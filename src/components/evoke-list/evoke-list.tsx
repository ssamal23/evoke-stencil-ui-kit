import { Component, Element, Prop, State, Event, EventEmitter, h } from '@stencil/core';
import { EvokeListItem, parseListItems, toValues } from '../../utils/list-items';
import { renderIcon } from '../../utils/icons';

@Component({ tag: 'evoke-list', styleUrl: 'evoke-list.css', shadow: false })
export class EvokeList {
  @Element() el!: HTMLElement;

  /** Items as an array of { label, value, description?, icon?, disabled? } or a JSON string of the same */
  @Prop() items: EvokeListItem[] | string = [];
  /** A plain list, or a selectable list (like a listbox) */
  @Prop() appearance: 'plain' | 'selectable' = 'plain';
  /** Selectable list: allow several selected items */
  @Prop() multiple = false;
  /** Selected value, or an array of values when `multiple` (selectable list) */
  @Prop({ mutable: true }) value: string | string[] = '';
  /** Accessible name for the list */
  @Prop() label = '';

  /** Emits the selected value, or the selected values (string[]) when `multiple` */
  @Event() evokeChange!: EventEmitter<string | string[]>;

  @State() activeIndex = -1;

  private get list() {
    return parseListItems(this.items);
  }

  private get selected() {
    return toValues(this.value, this.multiple);
  }

  /** The item that can be reached with Tab: the first selected one, otherwise the first enabled one */
  private get tabStop() {
    const list = this.list;
    if (this.activeIndex >= 0 && !list[this.activeIndex]?.disabled) return this.activeIndex;
    const sel = list.findIndex((i) => !i.disabled && this.selected.includes(i.value));
    return sel >= 0 ? sel : list.findIndex((i) => !i.disabled);
  }

  private choose(item: EvokeListItem) {
    if (item.disabled) return;
    if (this.multiple) {
      const cur = this.selected;
      const next = cur.includes(item.value) ? cur.filter((v) => v !== item.value) : [...cur, item.value];
      this.value = next;
      this.evokeChange.emit(next);
    } else if (this.value !== item.value) {
      this.value = item.value;
      this.evokeChange.emit(item.value);
    }
  }

  private move(from: number, step: number) {
    const list = this.list;
    for (let i = from + step; i >= 0 && i < list.length; i += step) {
      if (!list[i].disabled) return i;
    }
    return from;
  }

  private focusItem(index: number) {
    this.activeIndex = index;
    this.el.querySelectorAll<HTMLElement>('[role="option"]')[index]?.focus();
  }

  private onKeyDown = (e: KeyboardEvent, index: number) => {
    const list = this.list;
    if (e.key === 'ArrowDown') { e.preventDefault(); this.focusItem(this.move(index, 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); this.focusItem(this.move(index, -1)); }
    else if (e.key === 'Home') { e.preventDefault(); this.focusItem(list.findIndex((i) => !i.disabled)); }
    else if (e.key === 'End') {
      e.preventDefault();
      for (let i = list.length - 1; i >= 0; i--) if (!list[i].disabled) { this.focusItem(i); break; }
    } else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); this.choose(list[index]); }
  };

  private renderBody(item: EvokeListItem) {
    return [
      item.icon && renderIcon(item.icon, 'evoke-icon evoke-list__icon'),
      <span class="evoke-list__text">
        <span class="evoke-list__label">{item.label}</span>
        {item.description && <span class="evoke-list__desc">{item.description}</span>}
      </span>,
    ];
  }

  render() {
    const list = this.list;
    if (this.appearance !== 'selectable') {
      return (
        <ul class="evoke-list" role="list" aria-label={this.label || undefined}>
          {list.map((item) => (
            <li class={`evoke-list__item ${item.disabled ? 'evoke-list__item--disabled' : ''}`.trim()} aria-disabled={item.disabled ? 'true' : undefined}>
              {this.renderBody(item)}
            </li>
          ))}
        </ul>
      );
    }
    const tabStop = this.tabStop;
    const selected = this.selected;
    return (
      <ul class="evoke-list evoke-list--selectable" role="listbox" aria-label={this.label || undefined} aria-multiselectable={this.multiple ? 'true' : undefined}>
        {list.map((item, i) => {
          const on = selected.includes(item.value);
          return (
            <li
              role="option"
              class={`evoke-list__item evoke-list__item--option ${on ? 'evoke-list__item--selected' : ''} ${item.disabled ? 'evoke-list__item--disabled' : ''}`.trim()}
              aria-selected={on ? 'true' : 'false'}
              aria-disabled={item.disabled ? 'true' : undefined}
              tabindex={i === tabStop ? 0 : -1}
              onClick={() => { this.activeIndex = i; this.choose(item); }}
              onKeyDown={(e) => this.onKeyDown(e, i)}
              onFocus={() => { this.activeIndex = i; }}
            >
              {this.renderBody(item)}
              {on && renderIcon('check', 'evoke-icon evoke-list__check')}
            </li>
          );
        })}
      </ul>
    );
  }
}
