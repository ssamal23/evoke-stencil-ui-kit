import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';
import { EvokeIcon, renderIcon } from '../../utils/icons';

@Component({ tag: 'evoke-input', styleUrl: 'evoke-input.css', shadow: false })
export class EvokeInput {
  @Prop() label = '';
  @Prop({ mutable: true }) value = '';
  @Prop() type = 'text';
  @Prop() name = '';
  @Prop() placeholder = '';
  @Prop() disabled = false;
  @Prop() required = false;
  /** Outlined (default) or filled (tinted background, bottom border) */
  @Prop() appearance: 'outlined' | 'filled' = 'outlined';
  /** Error message shown below the field (replaces the hint) */
  @Prop() error = '';
  /** Helper text shown below the field */
  @Prop() hint = '';
  /** Optional leading icon */
  @Prop() icon?: EvokeIcon;
  /** Extra classes for the inner <input>, e.g. "form-control" (Bootstrap) */
  @Prop() inputClass = '';

  /** Emits the new value on every keystroke */
  @Event() evokeInput!: EventEmitter<string>;
  /** Emits the new value on commit (blur/enter) */
  @Event() evokeChange!: EventEmitter<string>;

  private inputId = `evoke-input-${Math.random().toString(36).slice(2, 9)}`;

  render() {
    const hasIcon = !!this.icon;
    const describedBy = this.error || this.hint ? `${this.inputId}-msg` : undefined;
    return (
      <div class={`evoke-field evoke-field--${this.appearance}`}>
        {this.label && <label htmlFor={this.inputId} class="evoke-field__label">{this.label}{this.required && <span aria-hidden="true"> *</span>}</label>}
        <div class="evoke-field__control">
          {renderIcon(this.icon, 'evoke-field__icon')}
          <input
            id={this.inputId}
            class={`evoke-field__input ${hasIcon ? 'evoke-field__input--icon' : ''} ${this.error ? 'evoke-field__input--error' : ''} ${this.inputClass}`.replace(/\s+/g, ' ').trim()}
            type={this.type}
            name={this.name || undefined}
            value={this.value}
            placeholder={this.placeholder}
            disabled={this.disabled}
            required={this.required}
            aria-invalid={this.error ? 'true' : undefined}
            aria-describedby={describedBy}
            onInput={(e) => {
              this.value = (e.target as HTMLInputElement).value;
              this.evokeInput.emit(this.value);
            }}
            onChange={(e) => this.evokeChange.emit((e.target as HTMLInputElement).value)}
          />
        </div>
        {this.error ? (
          <span id={describedBy} class="evoke-field__error" role="alert">{this.error}</span>
        ) : (
          this.hint && <span id={describedBy} class="evoke-field__hint">{this.hint}</span>
        )}
      </div>
    );
  }
}
