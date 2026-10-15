import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';
import { EvokeOption, parseOptions } from '../../utils/options';

@Component({ tag: 'evoke-radio-group', styleUrl: 'evoke-radio-group.css', shadow: false })
export class EvokeRadioGroup {
  @Prop() label = '';
  /** Options as an array of { label, value, disabled? } or a JSON string of the same */
  @Prop() options: EvokeOption[] | string = [];
  @Prop({ mutable: true }) value = '';
  @Prop() name = '';
  @Prop() disabled = false;
  /** Lay options out in a row instead of a column */
  @Prop() inline = false;
  /** Error message shown below the group */
  @Prop() error = '';

  /** Emits the selected value */
  @Event() evokeChange!: EventEmitter<string>;

  private groupName = `evoke-radio-${Math.random().toString(36).slice(2, 9)}`;

  render() {
    const name = this.name || this.groupName;
    return (
      <div class="evoke-radio" role="radiogroup" aria-label={this.label || undefined}>
        {this.label && <span class="evoke-radio__label">{this.label}</span>}
        <div class={`evoke-radio__options ${this.inline ? 'evoke-radio__options--inline' : ''}`}>
          {parseOptions(this.options).map((o) => {
            const off = this.disabled || o.disabled;
            return (
              <label class={`evoke-radio__row ${off ? 'evoke-radio__row--disabled' : ''}`}>
                <input
                  type="radio"
                  class={`evoke-radio__input ${this.error ? 'evoke-radio__input--error' : ''}`.trim()}
                  name={name}
                  value={o.value}
                  checked={o.value === this.value}
                  disabled={off}
                  onChange={() => {
                    this.value = o.value;
                    this.evokeChange.emit(this.value);
                  }}
                />
                <span>{o.label}</span>
              </label>
            );
          })}
        </div>
        {this.error && <span class="evoke-radio__error" role="alert">{this.error}</span>}
      </div>
    );
  }
}
