import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';

@Component({ tag: 'evoke-switch', styleUrl: 'evoke-switch.css', shadow: false })
export class EvokeSwitch {
  @Prop({ mutable: true, reflect: true }) checked = false;
  /** Optional visible label. Without a label or description it is a plain toggle. */
  @Prop() label = '';
  /** Secondary text under the label */
  @Prop() description = '';
  @Prop() disabled = false;
  /** aria-label for a plain toggle that has no visible label */
  @Prop() accessibleLabel?: string;

  /** Emits the new checked state */
  @Event() evokeChange!: EventEmitter<boolean>;

  private uid = Math.random().toString(36).slice(2, 9);

  render() {
    const descId = `evoke-switch-${this.uid}-desc`;
    return (
      <label class={`evoke-switch ${this.disabled ? 'evoke-switch--disabled' : ''}`.trim()}>
        <input
          type="checkbox"
          role="switch"
          class="evoke-switch__input"
          checked={this.checked}
          disabled={this.disabled}
          aria-checked={this.checked ? 'true' : 'false'}
          aria-label={!this.label ? this.accessibleLabel : undefined}
          aria-describedby={this.description ? descId : undefined}
          onChange={(e) => {
            this.checked = (e.target as HTMLInputElement).checked;
            this.evokeChange.emit(this.checked);
          }}
        />
        <span class="evoke-switch__track" aria-hidden="true"><span class="evoke-switch__thumb" /></span>
        {(this.label || this.description) && (
          <span class="evoke-switch__text">
            {this.label && <span class="evoke-switch__label">{this.label}</span>}
            {this.description && <span id={descId} class="evoke-switch__desc">{this.description}</span>}
          </span>
        )}
      </label>
    );
  }
}
