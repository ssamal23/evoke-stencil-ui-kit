import { Component, Element, Prop, State, Event, EventEmitter, h } from '@stencil/core';
import { renderIcon } from '../../utils/icons';

export interface EvokeTreeNode {
  label: string;
  value: string;
  children?: EvokeTreeNode[];
  disabled?: boolean;
}

function parseNodes(nodes: EvokeTreeNode[] | string): EvokeTreeNode[] {
  if (Array.isArray(nodes)) return nodes;
  try {
    const parsed = JSON.parse(nodes);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function parseList(v: string | string[]): string[] {
  if (Array.isArray(v)) return v;
  if (!v) return [];
  if (v.trim().startsWith('[')) {
    try {
      const p = JSON.parse(v);
      if (Array.isArray(p)) return p.map(String);
    } catch { /* fall through to a comma list */ }
  }
  return v.split(',').map((s) => s.trim()).filter(Boolean);
}

interface Row { node: EvokeTreeNode; level: number; parent?: string; size: number; pos: number }

@Component({ tag: 'evoke-tree', styleUrl: 'evoke-tree.css', shadow: false })
export class EvokeTree {
  @Element() el!: HTMLElement;

  /** Nodes as an array of { label, value, children?, disabled? } or a JSON string of the same */
  @Prop() nodes: EvokeTreeNode[] | string = [];
  /** Value of the selected node */
  @Prop({ mutable: true }) value = '';
  /** Values of the nodes that are open: an array, a JSON string, or a comma list */
  @Prop({ mutable: true }) expanded: string[] | string = [];
  /** Open every node at the start (only when `expanded` is empty) */
  @Prop() expandAll = false;
  /** Accessible name for the tree */
  @Prop() label = '';

  /** Emits the value of the node that was selected */
  @Event() evokeChange!: EventEmitter<string>;
  /** Emits when a node is opened or closed */
  @Event() evokeToggle!: EventEmitter<{ value: string; expanded: boolean }>;

  @State() activeValue = '';
  @State() initialised = false;

  private pendingFocus = false;

  componentWillLoad() {
    if (this.expandAll && parseList(this.expanded).length === 0) {
      const all: string[] = [];
      const walk = (ns: EvokeTreeNode[]) => ns.forEach((n) => { if (n.children?.length) { all.push(n.value); walk(n.children); } });
      walk(parseNodes(this.nodes));
      this.expanded = all;
    }
  }

  componentDidRender() {
    if (this.pendingFocus) {
      this.pendingFocus = false;
      this.el.querySelector<HTMLElement>('[role="treeitem"][tabindex="0"]')?.focus();
    }
  }

  private get open() { return new Set(parseList(this.expanded)); }

  private rows(): Row[] {
    const open = this.open;
    const out: Row[] = [];
    const walk = (nodes: EvokeTreeNode[], level: number, parent?: string) => {
      nodes.forEach((node, i) => {
        out.push({ node, level, parent, size: nodes.length, pos: i + 1 });
        if (node.children?.length && open.has(node.value)) walk(node.children, level + 1, node.value);
      });
    };
    walk(parseNodes(this.nodes), 1);
    return out;
  }

  private setOpen(value: string, on: boolean) {
    const cur = parseList(this.expanded);
    if (on === cur.includes(value)) return;
    this.expanded = on ? [...cur, value] : cur.filter((v) => v !== value);
    this.evokeToggle.emit({ value, expanded: on });
  }

  private select(node: EvokeTreeNode) {
    if (node.disabled) return;
    this.activeValue = node.value;
    if (this.value !== node.value) {
      this.value = node.value;
      this.evokeChange.emit(node.value);
    }
  }

  private focusRow(value: string) {
    this.activeValue = value;
    this.pendingFocus = true;
  }

  private onKeyDown = (e: KeyboardEvent, rows: Row[], i: number) => {
    const row = rows[i];
    const hasKids = !!row.node.children?.length;
    const isOpen = this.open.has(row.node.value);
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); if (rows[i + 1]) this.focusRow(rows[i + 1].node.value); break;
      case 'ArrowUp': e.preventDefault(); if (rows[i - 1]) this.focusRow(rows[i - 1].node.value); break;
      case 'Home': e.preventDefault(); this.focusRow(rows[0].node.value); break;
      case 'End': e.preventDefault(); this.focusRow(rows[rows.length - 1].node.value); break;
      case 'ArrowRight':
        e.preventDefault();
        if (hasKids && !isOpen) this.setOpen(row.node.value, true);
        else if (hasKids && rows[i + 1]) this.focusRow(rows[i + 1].node.value);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (hasKids && isOpen) this.setOpen(row.node.value, false);
        else if (row.parent) this.focusRow(row.parent);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        this.select(row.node);
        break;
    }
  };

  render() {
    const rows = this.rows();
    const open = this.open;
    const tabStop = rows.some((r) => r.node.value === this.activeValue) ? this.activeValue : rows.find((r) => r.node.value === this.value)?.node.value ?? rows[0]?.node.value;
    return (
      <ul class="evoke-tree" role="tree" aria-label={this.label || undefined}>
        {rows.map((row, i) => {
          const { node } = row;
          const hasKids = !!node.children?.length;
          const isOpen = open.has(node.value);
          const on = node.value === this.value;
          return (
            <li
              role="treeitem"
              class={`evoke-tree__item ${on ? 'evoke-tree__item--selected' : ''} ${node.disabled ? 'evoke-tree__item--disabled' : ''}`.replace(/\s+/g, ' ').trim()}
              style={{ '--evoke-tree-level': String(row.level) }}
              aria-level={String(row.level)}
              aria-setsize={String(row.size)}
              aria-posinset={String(row.pos)}
              aria-expanded={hasKids ? (isOpen ? 'true' : 'false') : undefined}
              aria-selected={on ? 'true' : 'false'}
              aria-disabled={node.disabled ? 'true' : undefined}
              tabindex={node.value === tabStop ? 0 : -1}
              onClick={(e) => { e.stopPropagation(); this.select(node); }}
              onFocus={() => { this.activeValue = node.value; }}
              onKeyDown={(e) => this.onKeyDown(e, rows, i)}
            >
              {hasKids ? (
                <button
                  type="button"
                  class={`evoke-tree__toggle ${isOpen ? 'evoke-tree__toggle--open' : ''}`.trim()}
                  tabindex={-1}
                  aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${node.label}`}
                  onClick={(e) => { e.stopPropagation(); this.setOpen(node.value, !isOpen); }}
                >
                  {renderIcon('chevron-right', 'evoke-icon')}
                </button>
              ) : (
                <span class="evoke-tree__spacer" aria-hidden="true" />
              )}
              <span class="evoke-tree__label">{node.label}</span>
            </li>
          );
        })}
      </ul>
    );
  }
}
