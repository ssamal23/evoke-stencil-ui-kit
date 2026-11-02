import { Component, Element, Prop, State, Event, EventEmitter, Listen, h } from '@stencil/core';
import { EvokeOption, parseOptions } from '../../utils/options';
import { renderIcon } from '../../utils/icons';

@Component({ tag: 'evoke-select', styleUrl: 'evoke-select.css', shadow: false })
export class EvokeSelect {
  @Element() el!: HTMLElement;

  @Prop() label = '';
  /** Options as an array of { label, value, disabled? } or a JSON string of the same */
  @Prop() options: EvokeOption[] | string = [];
  /** Selected value (string), or an array of values when `multiple` */
  @Prop({ mutable: true }) value: string | string[] = '';
  @Prop() placeholder = 'Select an option';
  /** Multi-select: selected values are shown as removable chips */
  @Prop() multiple = false;
  /** Adds a search box that filters the options */
  @Prop() searchable = false;
  @Prop() disabled = false;
  /** Error message shown below the field (replaces the hint) */
  @Prop() error = '';
  @Prop() hint = '';
  /** Extra classes for the inner <select> (single, non-searchable mode), e.g. "form-select" */
  @Prop() selectClass = '';

  /** Emits the selected value (string) or the selected values (string[]) when `multiple` */
  @Event() evokeChange!: EventEmitter<string | string[]>;

  @State() isOpen = false;
  @State() query = '';
  @State() activeIndex = 0;

  private uid = Math.random().toString(36).slice(2, 9);
  private triggerEl?: HTMLElement;
  private searchEl?: HTMLInputElement;
  private focusSearch = false;

  private get selected(): string[] {
    const v = this.value;
    if (Array.isArray(v)) return v;
    if (!v) return [];
    if (this.multiple) {
      if (v.trim().startsWith('[')) {
        try {
          const parsed = JSON.parse(v);
          if (Array.isArray(parsed)) return parsed.map(String);
        } catch { /* fall through to comma list */ }
      }
      return v.split(',').map((s) => s.trim()).filter(Boolean);
    }
    return [v];
  }

  private get filtered(): EvokeOption[] {
    const q = this.query.trim().toLowerCase();
    const all = parseOptions(this.options);
    return q ? all.filter((o) => o.label.toLowerCase().includes(q)) : all;
  }

  @Listen('click', { target: 'document' })
  onDocClick(e: MouseEvent) {
    if (this.isOpen && !this.el.contains(e.target as Node)) this.closePanel(false);
  }

  componentDidRender() {
    if (!this.isOpen) return;
    if (this.focusSearch && this.searchEl) {
      this.focusSearch = false;
      this.searchEl.focus();
    }
    this.el.querySelector('.evoke-select__option--active')?.scrollIntoView({ block: 'nearest' });
  }

  private openPanel() {
    if (this.disabled) return;
    const first = this.filtered.findIndex((o) => this.selected.includes(o.value));
    this.activeIndex = first >= 0 ? first : 0;
    this.isOpen = true;
    this.focusSearch = this.searchable;
  }

  private closePanel(refocus = true) {
    this.isOpen = false;
    this.query = '';
    if (refocus) this.triggerEl?.focus();
  }

  private commit(next: string | string[]) {
    this.value = next;
    this.evokeChange.emit(next);
  }

  private toggle(o: EvokeOption) {
    if (o.disabled) return;
    if (this.multiple) {
      const cur = this.selected;
      this.commit(cur.includes(o.value) ? cur.filter((v) => v !== o.value) : [...cur, o.value]);
    } else {
      this.commit(o.value);
      this.closePanel();
    }
  }

  private removeChip(v: string) {
    this.commit(this.selected.filter((x) => x !== v));
  }

  private onKeyDown = (e: KeyboardEvent) => {
    const list = this.filtered;
    const onTrigger = e.target === this.triggerEl;
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowUp': {
        e.preventDefault();
        if (!this.isOpen) return this.openPanel();
        const step = e.key === 'ArrowDown' ? 1 : -1;
        this.activeIndex = Math.min(Math.max(this.activeIndex + step, 0), Math.max(list.length - 1, 0));
        break;
      }
      case 'Home':
      case 'End':
        if (this.isOpen && !this.searchable) {
          e.preventDefault();
          this.activeIndex = e.key === 'Home' ? 0 : Math.max(list.length - 1, 0);
        }
        break;
      case 'Enter':
      case ' ':
        if (e.key === ' ' && !onTrigger) return; // allow typing spaces in the search box
        e.preventDefault();
        if (!this.isOpen) return this.openPanel();
        if (list[this.activeIndex]) this.toggle(list[this.activeIndex]);
        break;
      case 'Escape':
        if (this.isOpen) {
          e.preventDefault();
          this.closePanel();
        }
        break;
      case 'Tab':
        if (this.isOpen) this.closePanel(false);
        break;
    }
  };

  private renderNative() {
    const selectId = `evoke-select-${this.uid}`;
    const msgId = `${selectId}-msg`;
    const cur = this.selected[0] ?? '';
    return (
      <div class="evoke-field__control">
        <select
          id={selectId}
          class={`evoke-field__input evoke-field__select ${cur === '' ? 'evoke-field__select--empty' : ''} ${this.error ? 'evoke-field__input--error' : ''} ${this.selectClass}`.replace(/\s+/g, ' ').trim()}
          disabled={this.disabled}
          aria-invalid={this.error ? 'true' : undefined}
          aria-describedby={this.error || this.hint ? msgId : undefined}
          onChange={(e) => this.commit((e.target as HTMLSelectElement).value)}
        >
          <option value="" disabled selected={cur === ''}>{this.placeholder}</option>
          {parseOptions(this.options).map((o) => (
            <option value={o.value} disabled={o.disabled} selected={o.value === cur}>{o.label}</option>
          ))}
        </select>
        {renderIcon('chevron-down', 'evoke-field__chevron')}
      </div>
    );
  }

  private renderCustom() {
    const labelId = `evoke-select-${this.uid}-label`;
    const listId = `evoke-select-${this.uid}-list`;
    const msgId = `evoke-select-${this.uid}-msg`;
    const all = parseOptions(this.options);
    const sel = this.selected;
    const list = this.filtered;
    const labelOf = (v: string) => all.find((o) => o.value === v)?.label ?? v;

    return (
      <div class="evoke-field__control" onKeyDown={this.onKeyDown}>
        <div
          class={`evoke-select__trigger evoke-field__input ${this.error ? 'evoke-field__input--error' : ''} ${this.disabled ? 'evoke-select__trigger--disabled' : ''}`.trim()}
          role="combobox"
          tabindex={this.disabled ? -1 : 0}
          aria-haspopup="listbox"
          aria-expanded={this.isOpen ? 'true' : 'false'}
          aria-controls={listId}
          aria-labelledby={this.label ? labelId : undefined}
          aria-label={this.label ? undefined : this.placeholder}
          aria-disabled={this.disabled ? 'true' : undefined}
          aria-invalid={this.error ? 'true' : undefined}
          aria-describedby={this.error || this.hint ? msgId : undefined}
          aria-activedescendant={this.isOpen && list[this.activeIndex] ? `${listId}-${this.activeIndex}` : undefined}
          ref={(el) => (this.triggerEl = el)}
          onClick={() => (this.isOpen ? this.closePanel() : this.openPanel())}
        >
          <span class="evoke-select__value">
            {sel.length === 0 && <span class="evoke-select__placeholder">{this.placeholder}</span>}
            {this.multiple
              ? sel.map((v) => (
                  <span class="evoke-select__chip">
                    {labelOf(v)}
                    <button
                      type="button"
                      class="evoke-select__chip-remove"
                      aria-label={`Remove ${labelOf(v)}`}
                      disabled={this.disabled}
                      onClick={(e) => {
                        e.stopPropagation();
                        this.removeChip(v);
                      }}
                    >
                      {renderIcon('x', 'evoke-icon')}
                    </button>
                  </span>
                ))
              : sel.length > 0 && <span>{labelOf(sel[0])}</span>}
          </span>
        </div>
        {renderIcon('chevron-down', 'evoke-field__chevron')}
        {this.isOpen && (
          <div class="evoke-select__panel">
            {this.searchable && (
              <input
                class="evoke-select__search"
                type="text"
                placeholder="Search…"
                aria-label="Search options"
                aria-controls={listId}
                aria-activedescendant={list[this.activeIndex] ? `${listId}-${this.activeIndex}` : undefined}
                value={this.query}
                ref={(el) => (this.searchEl = el)}
                onInput={(e) => {
                  this.query = (e.target as HTMLInputElement).value;
                  this.activeIndex = 0;
                }}
              />
            )}
            <ul id={listId} class="evoke-select__list" role="listbox" aria-multiselectable={this.multiple ? 'true' : undefined} aria-labelledby={this.label ? labelId : undefined}>
              {list.map((o, i) => {
                const isSel = sel.includes(o.value);
                return (
                  <li
                    id={`${listId}-${i}`}
                    role="option"
                    aria-selected={isSel ? 'true' : 'false'}
                    aria-disabled={o.disabled ? 'true' : undefined}
                    class={`evoke-select__option ${i === this.activeIndex ? 'evoke-select__option--active' : ''} ${isSel ? 'evoke-select__option--selected' : ''} ${o.disabled ? 'evoke-select__option--disabled' : ''}`.replace(/\s+/g, ' ').trim()}
                    onMouseEnter={() => (this.activeIndex = i)}
                    onClick={() => this.toggle(o)}
                  >
                    <span>{o.label}</span>
                    {isSel && renderIcon('check', 'evoke-icon')}
                  </li>
                );
              })}
            </ul>
            {list.length === 0 && <div class="evoke-select__empty">No results</div>}
          </div>
        )}
      </div>
    );
  }

  render() {
    const labelId = `evoke-select-${this.uid}-label`;
    const msgId = `evoke-select-${this.uid}-msg`;
    const custom = this.multiple || this.searchable;
    return (
      <div class="evoke-field">
        {this.label && (
          <label id={labelId} htmlFor={custom ? undefined : `evoke-select-${this.uid}`} class="evoke-field__label">{this.label}</label>
        )}
        {custom ? this.renderCustom() : this.renderNative()}
        {this.error ? (
          <span id={msgId} class="evoke-field__error" role="alert">{this.error}</span>
        ) : (
          this.hint && <span id={msgId} class="evoke-field__hint">{this.hint}</span>
        )}
      </div>
    );
  }
}
