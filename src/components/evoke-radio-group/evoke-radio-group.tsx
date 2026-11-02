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
  /** Classic radio circles, or a segmented button group */
  @Prop() appearance: 'classic' | 'segmented' = 'classic';
  /** Lay classic options out in a row instead of a column */
  @Prop() inline = false;
  /** Error message shown below the group */
  @Prop() error = '';

  /** Emits the selected value */
  @Event() evokeChange!: EventEmitter<string>;

  private uid = Math.random().toString(36).slice(2, 9);

  render() {
    const name = this.name || `evoke-radio-${this.uid}`;
    const labelId = `${name}-label`;
    const errId = `${name}-err`;
    const segmented = this.appearance === 'segmented';
    return (
      <div class="evoke-radio" role="radiogroup" aria-labelledby={this.label ? labelId : undefined} aria-describedby={this.error ? errId : undefined}>
        {this.label && <span id={labelId} class="evoke-radio__label">{this.label}</span>}
        <div class={`evoke-radio__options ${this.inline && !segmented ? 'evoke-radio__options--inline' : ''} ${segmented ? 'evoke-radio__options--segmented' : ''}`.replace(/\s+/g, ' ').trim()}>
          {parseOptions(this.options).map((o) => {
            const off = this.disabled || o.disabled;
            const input = (
              <input
                type="radio"
                class={`${segmented ? 'evoke-seg__input' : 'evoke-radio__input'} ${this.error ? 'evoke-radio__input--error' : ''}`.trim()}
                name={name}
                value={o.value}
                checked={o.value === this.value}
                disabled={off}
                onChange={() => {
                  this.value = o.value;
                  this.evokeChange.emit(this.value);
                }}
              />
            );
            return segmented ? (
              <label class={`evoke-seg ${off ? 'evoke-seg--disabled' : ''}`.trim()}>
                {input}
                <span class="evoke-seg__text">{o.label}</span>
              </label>
            ) : (
              <label class={`evoke-radio__row ${off ? 'evoke-radio__row--disabled' : ''}`.trim()}>
                {input}
                <span>{o.label}</span>
              </label>
            );
          })}
        </div>
        {this.error && <span id={errId} class="evoke-radio__error" role="alert">{this.error}</span>}
      </div>
    );
  }
}
