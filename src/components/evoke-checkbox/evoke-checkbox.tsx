import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';

@Component({ tag: 'evoke-checkbox', styleUrl: 'evoke-checkbox.css', shadow: false })
export class EvokeCheckbox {
  @Prop() label = '';
  @Prop({ mutable: true, reflect: true }) checked = false;
  @Prop() disabled = false;
  /** Error message shown below the checkbox */
  @Prop() error = '';
  /** Extra classes for the inner <input> */
  @Prop() inputClass = '';

  /** Emits the new checked state */
  @Event() evokeChange!: EventEmitter<boolean>;

  render() {
    return (
      <div class="evoke-check">
        <label class={`evoke-check__row ${this.disabled ? 'evoke-check__row--disabled' : ''}`}>
          <input
            type="checkbox"
            class={`evoke-check__input ${this.error ? 'evoke-check__input--error' : ''} ${this.inputClass}`.trim()}
            checked={this.checked}
            disabled={this.disabled}
            aria-invalid={this.error ? 'true' : undefined}
            onChange={(e) => {
              this.checked = (e.target as HTMLInputElement).checked;
              this.evokeChange.emit(this.checked);
            }}
          />
          <span class="evoke-check__label">{this.label}<slot /></span>
        </label>
        {this.error && <span class="evoke-check__error" role="alert">{this.error}</span>}
      </div>
    );
  }
}
