import { Component, Element, Prop, State, Event, EventEmitter, Listen, h } from '@stencil/core';
import { renderIcon } from '../../utils/icons';

const pad = (n: number) => String(n).padStart(2, '0');
const toIso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** Parses YYYY-MM-DD as a local date. Returns undefined for anything else, including dates that do not exist (2025-02-30). */
function parseIso(value: string | undefined): Date | undefined {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec((value ?? '').trim());
  if (!m) return undefined;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return toIso(d) === `${m[1]}-${m[2]}-${m[3]}` ? d : undefined;
}

const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
/** Moves by whole months and keeps the day inside the new month (31 Jan + 1 month = 28/29 Feb). */
function addMonths(d: Date, n: number) {
  const first = new Date(d.getFullYear(), d.getMonth() + n, 1);
  const last = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  return new Date(first.getFullYear(), first.getMonth(), Math.min(d.getDate(), last));
}

@Component({ tag: 'evoke-datepicker', styleUrl: 'evoke-datepicker.css', shadow: false })
export class EvokeDatepicker {
  @Element() el!: HTMLElement;

  @Prop() label = '';
  /** Selected date as YYYY-MM-DD (empty for none) */
  @Prop({ mutable: true }) value = '';
  /** Earliest date that can be chosen, YYYY-MM-DD */
  @Prop() min = '';
  /** Latest date that can be chosen, YYYY-MM-DD */
  @Prop() max = '';
  @Prop() placeholder = 'YYYY-MM-DD';
  @Prop() disabled = false;
  @Prop() required = false;
  /** Error message shown below the field (replaces the hint) */
  @Prop() error = '';
  @Prop() hint = '';
  /** Language for month and weekday names, e.g. "en-US", "de-DE" */
  @Prop() locale = 'en-US';
  /** First day of the week: 0 = Sunday, 1 = Monday */
  @Prop() weekStart: 0 | 1 = 0;

  /** Emits the chosen date as YYYY-MM-DD, or an empty string when cleared */
  @Event() evokeChange!: EventEmitter<string>;

  @State() isOpen = false;
  @State() viewDate = new Date();
  @State() focusDate = new Date();
  @State() typed: string | null = null;
  @State() typedError = '';

  private uid = Math.random().toString(36).slice(2, 9);
  private inputEl?: HTMLInputElement;
  private pendingFocus = false;

  @Listen('click', { target: 'document' })
  onDocClick(e: MouseEvent) {
    if (this.isOpen && !this.el.contains(e.target as Node)) this.close(false);
  }

  componentDidRender() {
    if (this.isOpen && this.pendingFocus) {
      this.pendingFocus = false;
      this.el.querySelector<HTMLElement>(`[data-date="${toIso(this.focusDate)}"]`)?.focus();
    }
  }

  private get minDate() { return parseIso(this.min); }
  private get maxDate() { return parseIso(this.max); }

  private allowed(d: Date) {
    const lo = this.minDate;
    const hi = this.maxDate;
    return !(lo && d < lo) && !(hi && d > hi);
  }

  private open() {
    if (this.disabled) return;
    const start = parseIso(this.value) ?? new Date();
    this.focusDate = start;
    this.viewDate = start;
    this.isOpen = true;
    this.pendingFocus = true;
  }

  private close(refocus = true) {
    this.isOpen = false;
    if (refocus) this.inputEl?.focus();
  }

  private commit(d: Date | undefined) {
    this.value = d ? toIso(d) : '';
    this.typed = null;
    this.typedError = '';
    this.evokeChange.emit(this.value);
  }

  private pick(d: Date) {
    if (!this.allowed(d)) return;
    this.commit(d);
    this.close();
  }

  private moveFocus(d: Date) {
    // Stay inside min and max: a day that cannot be chosen cannot take focus either.
    const lo = this.minDate;
    const hi = this.maxDate;
    if (lo && d < lo) d = lo;
    if (hi && d > hi) d = hi;
    this.focusDate = d;
    this.viewDate = d;
    this.pendingFocus = true;
  }

  private onInputChange = (e: Event) => {
    const text = (e.target as HTMLInputElement).value.trim();
    if (text === '') return this.commit(undefined);
    const d = parseIso(text);
    if (!d) { this.typed = text; this.typedError = 'Enter a date as YYYY-MM-DD'; return; }
    if (!this.allowed(d)) { this.typed = text; this.typedError = 'This date is not available'; return; }
    this.commit(d);
  };

  private onGridKey = (e: KeyboardEvent) => {
    const f = this.focusDate;
    const dow = (f.getDay() - this.weekStart + 7) % 7;
    switch (e.key) {
      case 'ArrowLeft': e.preventDefault(); return this.moveFocus(addDays(f, -1));
      case 'ArrowRight': e.preventDefault(); return this.moveFocus(addDays(f, 1));
      case 'ArrowUp': e.preventDefault(); return this.moveFocus(addDays(f, -7));
      case 'ArrowDown': e.preventDefault(); return this.moveFocus(addDays(f, 7));
      case 'Home': e.preventDefault(); return this.moveFocus(addDays(f, -dow));
      case 'End': e.preventDefault(); return this.moveFocus(addDays(f, 6 - dow));
      case 'PageUp': e.preventDefault(); return this.moveFocus(addMonths(f, e.shiftKey ? -12 : -1));
      case 'PageDown': e.preventDefault(); return this.moveFocus(addMonths(f, e.shiftKey ? 12 : 1));
      case 'Escape': e.preventDefault(); return this.close();
      case 'Enter':
      case ' ': e.preventDefault(); return this.pick(f);
    }
  };

  private showMonth(delta: number) {
    this.viewDate = addMonths(this.viewDate, delta);
    this.focusDate = addMonths(this.focusDate, delta);
  }

  private weeks(): Date[][] {
    const first = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
    const lead = (first.getDay() - this.weekStart + 7) % 7;
    const start = addDays(first, -lead);
    return Array.from({ length: 6 }, (_, w) => Array.from({ length: 7 }, (_, d) => addDays(start, w * 7 + d)));
  }

  private renderCalendar() {
    const fmtMonth = new Intl.DateTimeFormat(this.locale, { month: 'long', year: 'numeric' });
    const fmtDay = new Intl.DateTimeFormat(this.locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const fmtWeekday = new Intl.DateTimeFormat(this.locale, { weekday: 'short' });
    const sunday = new Date(2023, 0, 1); // a known Sunday
    const weekdays = Array.from({ length: 7 }, (_, i) => addDays(sunday, i + this.weekStart));
    const selected = parseIso(this.value);
    const todayIso = toIso(new Date());
    const monthIdx = this.viewDate.getMonth();
    const gridId = `evoke-datepicker-${this.uid}-grid`;
    return (
      <div class="evoke-datepicker__panel" role="dialog" aria-label={`Choose a date${this.label ? `: ${this.label}` : ''}`}>
        <div class="evoke-datepicker__nav">
          <button type="button" class="evoke-datepicker__navbtn" aria-label="Previous month" onClick={() => this.showMonth(-1)}>{renderIcon('chevron-left', 'evoke-icon')}</button>
          <span class="evoke-datepicker__title" id={`${gridId}-title`} aria-live="polite">{fmtMonth.format(this.viewDate)}</span>
          <button type="button" class="evoke-datepicker__navbtn" aria-label="Next month" onClick={() => this.showMonth(1)}>{renderIcon('chevron-right', 'evoke-icon')}</button>
        </div>
        <table class="evoke-datepicker__grid" role="grid" aria-labelledby={`${gridId}-title`} onKeyDown={this.onGridKey}>
          <thead>
            <tr>{weekdays.map((d) => <th scope="col" class="evoke-datepicker__dow" abbr={fmtDay.format(d).split(',')[0]}>{fmtWeekday.format(d)}</th>)}</tr>
          </thead>
          <tbody>
            {this.weeks().map((week) => (
              <tr>
                {week.map((d) => {
                  const iso = toIso(d);
                  const outside = d.getMonth() !== monthIdx;
                  const isSel = !!selected && iso === toIso(selected);
                  const ok = this.allowed(d);
                  return (
                    <td role="gridcell" aria-selected={isSel ? 'true' : undefined}>
                      <button
                        type="button"
                        data-date={iso}
                        class={`evoke-datepicker__day ${outside ? 'evoke-datepicker__day--outside' : ''} ${isSel ? 'evoke-datepicker__day--selected' : ''} ${iso === todayIso ? 'evoke-datepicker__day--today' : ''}`.replace(/\s+/g, ' ').trim()}
                        tabindex={iso === toIso(this.focusDate) ? 0 : -1}
                        disabled={!ok}
                        aria-label={fmtDay.format(d)}
                        aria-current={iso === todayIso ? 'date' : undefined}
                        onClick={() => this.pick(d)}
                      >
                        {d.getDate()}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  render() {
    const inputId = `evoke-datepicker-${this.uid}`;
    const msg = this.typedError || this.error;
    const msgId = `${inputId}-msg`;
    const shown = this.typed ?? this.value;
    return (
      <div class="evoke-field">
        {this.label && <label htmlFor={inputId} class="evoke-field__label">{this.label}{this.required && <span aria-hidden="true"> *</span>}</label>}
        <div class="evoke-field__control">
          <input
            id={inputId}
            class={`evoke-field__input ${msg ? 'evoke-field__input--error' : ''}`.trim()}
            type="text"
            inputmode="numeric"
            autocomplete="off"
            placeholder={this.placeholder}
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
            class="evoke-datepicker__toggle"
            aria-label={this.label ? `Open calendar for ${this.label}` : 'Open calendar'}
            aria-haspopup="dialog"
            aria-expanded={this.isOpen ? 'true' : 'false'}
            disabled={this.disabled}
            onClick={() => (this.isOpen ? this.close() : this.open())}
          >
            {renderIcon('calendar', 'evoke-icon')}
          </button>
          {this.isOpen && this.renderCalendar()}
        </div>
        {msg ? <span id={msgId} class="evoke-field__error" role="alert">{msg}</span> : this.hint && <span id={msgId} class="evoke-field__hint">{this.hint}</span>}
      </div>
    );
  }
}
