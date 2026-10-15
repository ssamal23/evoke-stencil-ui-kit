import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';
import { EvokeOption, parseOptions } from '../../utils/options';

@Component({ tag: 'evoke-select', styleUrl: 'evoke-select.css', shadow: false })
export class EvokeSelect {
  @Prop() label = '';
  /** Options as an array of { label, value, disabled? } or a JSON string of the same */
  @Prop() options: EvokeOption[] | string = [];
  @Prop({ mutable: true }) value = '';
  @Prop() placeholder = 'Select an option';
  @Prop() disabled = false;
  /** Error message shown below the field */
  @Prop() error = '';
  /** Extra classes for the inner <select>, e.g. "form-select" (Bootstrap) */
  @Prop() selectClass = '';

  /** Emits the selected value */
  @Event() evokeChange!: EventEmitter<string>;

  private selectId = `evoke-select-${Math.random().toString(36).slice(2, 9)}`;

  render() {
    return (
      <div class="evoke-field">
        {this.label && <label htmlFor={this.selectId} class="evoke-field__label">{this.label}</label>}
        <div class="evoke-field__control">
          <select
            id={this.selectId}
            class={`evoke-field__input evoke-field__select ${this.value === '' ? 'evoke-field__select--empty' : ''} ${this.error ? 'evoke-field__input--error' : ''} ${this.selectClass}`.trim()}
            disabled={this.disabled}
            aria-invalid={this.error ? 'true' : undefined}
            onChange={(e) => {
              this.value = (e.target as HTMLSelectElement).value;
              this.evokeChange.emit(this.value);
            }}
          >
            <option value="" disabled selected={this.value === ''}>{this.placeholder}</option>
            {parseOptions(this.options).map((o) => (
              <option value={o.value} disabled={o.disabled} selected={o.value === this.value}>{o.label}</option>
            ))}
          </select>
          <svg class="evoke-field__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
        {this.error && <span class="evoke-field__error" role="alert">{this.error}</span>}
      </div>
    );
  }
}
