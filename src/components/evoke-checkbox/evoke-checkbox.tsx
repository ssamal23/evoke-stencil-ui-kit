import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';

@Component({ tag: 'evoke-checkbox', styleUrl: 'evoke-checkbox.css', shadow: false })
export class EvokeCheckbox {
  @Prop() label = '';
  @Prop({ mutable: true, reflect: true }) checked = false;
  /** Mixed state, e.g. a "select all" box when only some items are selected. Cleared on click. */
  @Prop({ mutable: true, reflect: true }) indeterminate = false;
  @Prop() disabled = false;
  /** Error message shown below the checkbox */
  @Prop() error = '';
  /** Extra classes for the inner <input> */
  @Prop() inputClass = '';

  /** Emits the new checked state */
  @Event() evokeChange!: EventEmitter<boolean>;

  private inputEl?: HTMLInputElement;
  private uid = Math.random().toString(36).slice(2, 9);

  componentDidRender() {
    if (this.inputEl) this.inputEl.indeterminate = this.indeterminate;
  }

  render() {
    const errId = `evoke-check-${this.uid}-err`;
    return (
      <div class="evoke-check">
        <label class={`evoke-check__row ${this.disabled ? 'evoke-check__row--disabled' : ''}`}>
          <input
            type="checkbox"
            class={`evoke-check__input ${this.error ? 'evoke-check__input--error' : ''} ${this.inputClass}`.trim()}
            checked={this.checked}
            disabled={this.disabled}
            aria-checked={this.indeterminate ? 'mixed' : undefined}
            aria-invalid={this.error ? 'true' : undefined}
            aria-describedby={this.error ? errId : undefined}
            ref={(el) => (this.inputEl = el)}
            onChange={(e) => {
              this.indeterminate = false;
              this.checked = (e.target as HTMLInputElement).checked;
              this.evokeChange.emit(this.checked);
            }}
          />
          <span class="evoke-check__label">{this.label}<slot /></span>
        </label>
        {this.error && <span id={errId} class="evoke-check__error" role="alert">{this.error}</span>}
      </div>
    );
  }
}
