import { Component, Element, Prop, State, Event, EventEmitter, Listen, h } from '@stencil/core';
import { renderIcon } from '../../utils/icons';

const pad = (n: number) => String(n).padStart(2, '0');

/** Parses "14:30", "2:30 PM" or "2:30pm" into 24-hour hour and minute. Returns undefined for anything else. */
function parseTime(text: string): { h: number; m: number } | undefined {
  const m = /^(\d{1,2}):(\d{2})\s*([ap]\.?m\.?)?$/i.exec(text.trim());
  if (!m) return undefined;
  let hour = Number(m[1]);
  const min = Number(m[2]);
  if (min > 59) return undefined;
  if (m[3]) {
    if (hour < 1 || hour > 12) return undefined;
    const pm = m[3].toLowerCase().startsWith('p');
    hour = (hour % 12) + (pm ? 12 : 0);
  } else if (hour > 23) return undefined;
  return { h: hour, m: min };
}

@Component({ tag: 'evoke-timepicker', styleUrl: 'evoke-timepicker.css', shadow: false })
export class EvokeTimepicker {
  @Element() el!: HTMLElement;

  @Prop() label = '';
  /** Selected time as 24-hour HH:MM (empty for none), whatever `twelveHour` shows */
  @Prop({ mutable: true }) value = '';
  /** Show and accept AM/PM instead of 24-hour time */
  @Prop() twelveHour = false;
  /** Gap between the minutes offered in the list, 1 to 30. You can still type any minute. */
  @Prop() step = 5;
  @Prop() placeholder = '';
  @Prop() disabled = false;
  @Prop() required = false;
  /** Error message shown below the field (replaces the hint) */
  @Prop() error = '';
  @Prop() hint = '';

  /** Emits the chosen time as 24-hour HH:MM, or an empty string when cleared */
  @Event() evokeChange!: EventEmitter<string>;

  @State() isOpen = false;
  @State() typed: string | null = null;
  @State() typedError = '';

  private uid = Math.random().toString(36).slice(2, 9);
  private inputEl?: HTMLInputElement;
  private pendingScroll = false;

  @Listen('click', { target: 'document' })
  onDocClick(e: MouseEvent) {
    if (this.isOpen && !this.el.contains(e.target as Node)) this.close(false);
  }

  componentDidRender() {
    if (this.isOpen && this.pendingScroll) {
      this.pendingScroll = false;
      this.el.querySelectorAll('.evoke-timepicker__opt--on').forEach((n) => (n as HTMLElement).scrollIntoView({ block: 'center' }));
    }
  }

  private get current() { return parseTime(this.value); }

  private display(t: { h: number; m: number } | undefined) {
    if (!t) return '';
    if (!this.twelveHour) return `${pad(t.h)}:${pad(t.m)}`;
    return `${t.h % 12 || 12}:${pad(t.m)} ${t.h >= 12 ? 'PM' : 'AM'}`;
  }

  private open() {
    if (this.disabled) return;
    this.isOpen = true;
    this.pendingScroll = true;
  }

  private close(refocus = true) {
    this.isOpen = false;
    if (refocus) this.inputEl?.focus();
  }

  private commit(t: { h: number; m: number } | undefined) {
    this.value = t ? `${pad(t.h)}:${pad(t.m)}` : '';
    this.typed = null;
    this.typedError = '';
    this.evokeChange.emit(this.value);
  }

  private set(part: Partial<{ h: number; m: number }>) {
    const cur = this.current ?? { h: 0, m: 0 };
    this.commit({ ...cur, ...part });
  }

  private onInputChange = (e: Event) => {
    const text = (e.target as HTMLInputElement).value.trim();
    if (text === '') return this.commit(undefined);
    const t = parseTime(text);
    if (!t) {
      this.typed = text;
      this.typedError = this.twelveHour ? 'Enter a time like 2:30 PM' : 'Enter a time like 14:30';
      return;
    }
    this.commit(t);
  };

  private onPanelKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); this.close(); }
  };

  private renderOptions(label: string, values: number[], selected: number | undefined, text: (n: number) => string, onPick: (n: number) => void) {
    return (
      <div class="evoke-timepicker__col" role="group" aria-label={label}>
        {values.map((n) => (
          <button
            type="button"
            class={`evoke-timepicker__opt ${n === selected ? 'evoke-timepicker__opt--on' : ''}`.trim()}
            aria-pressed={n === selected ? 'true' : 'false'}
            onClick={() => onPick(n)}
          >
            {text(n)}
          </button>
        ))}
      </div>
    );
  }

  private renderPanel() {
    const cur = this.current;
    const step = Math.min(Math.max(Math.floor(Number(this.step)) || 5, 1), 30);
    const minutes = Array.from({ length: Math.ceil(60 / step) }, (_, i) => i * step);
    const hours = this.twelveHour ? Array.from({ length: 12 }, (_, i) => i + 1) : Array.from({ length: 24 }, (_, i) => i);
    const hourSel = cur ? (this.twelveHour ? cur.h % 12 || 12 : cur.h) : undefined;
    const pm = cur ? cur.h >= 12 : false;
    return (
      <div class="evoke-timepicker__panel" role="dialog" aria-label={`Choose a time${this.label ? `: ${this.label}` : ''}`} onKeyDown={this.onPanelKey}>
        <div class="evoke-timepicker__cols">
          {this.renderOptions('Hour', hours, hourSel, (n) => (this.twelveHour ? String(n) : pad(n)), (n) => {
            const base = this.twelveHour ? n % 12 : n;
            this.set({ h: this.twelveHour ? base + (pm ? 12 : 0) : base });
          })}
          {this.renderOptions('Minute', minutes, cur?.m, pad, (n) => this.set({ m: n }))}
          {this.twelveHour && this.renderOptions('AM or PM', [0, 1], cur ? (pm ? 1 : 0) : undefined, (n) => (n ? 'PM' : 'AM'), (n) => {
            const c = this.current ?? { h: 0, m: 0 };
            this.set({ h: (c.h % 12) + (n ? 12 : 0) });
          })}
        </div>
        <div class="evoke-timepicker__foot">
          <button type="button" class="evoke-timepicker__done" onClick={() => this.close()}>Done</button>
        </div>
      </div>
    );
  }

  render() {
    const inputId = `evoke-timepicker-${this.uid}`;
    const msg = this.typedError || this.error;
    const msgId = `${inputId}-msg`;
    const shown = this.typed ?? this.display(this.current);
    return (
      <div class="evoke-field">
        {this.label && <label htmlFor={inputId} class="evoke-field__label">{this.label}{this.required && <span aria-hidden="true"> *</span>}</label>}
        <div class="evoke-field__control">
          <input
            id={inputId}
            class={`evoke-field__input ${msg ? 'evoke-field__input--error' : ''}`.trim()}
            type="text"
            autocomplete="off"
            placeholder={this.placeholder || (this.twelveHour ? 'h:mm AM' : 'HH:MM')}
            value={shown}
            disabled={this.disabled}
            required={this.required}
            aria-invalid={msg ? 'true' : undefined}
            aria-describedby={msg || this.hint ? msgId : undefined}
            ref={(el) => (this.inputEl = el)}
            onChange={this.onInputChange}
            onKeyDown={(e) => { if (e.key === 'ArrowDown' && e.altKey) { e.preventDefault(); this.open(); } }}
          />
          <button
            type="button"
            class="evoke-timepicker__toggle"
            aria-label={this.label ? `Open time list for ${this.label}` : 'Open time list'}
            aria-haspopup="dialog"
            aria-expanded={this.isOpen ? 'true' : 'false'}
            disabled={this.disabled}
            onClick={() => (this.isOpen ? this.close() : this.open())}
          >
            {renderIcon('clock', 'evoke-icon')}
          </button>
          {this.isOpen && this.renderPanel()}
        </div>
        {msg ? <span id={msgId} class="evoke-field__error" role="alert">{msg}</span> : this.hint && <span id={msgId} class="evoke-field__hint">{this.hint}</span>}
      </div>
    );
  }
}
