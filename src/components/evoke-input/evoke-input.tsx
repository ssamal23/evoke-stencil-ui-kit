import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';

const ICONS: Record<string, string[]> = {
  mail: ['M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z', 'm22 7-10 6L2 7'],
  lock: ['M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z', 'M7 11V7a5 5 0 0 1 10 0v4'],
  user: ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2', 'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'],
  search: ['M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z', 'm21 21-4.3-4.3'],
};

@Component({ tag: 'evoke-input', styleUrl: 'evoke-input.css', shadow: false })
export class EvokeInput {
  @Prop() label = '';
  @Prop({ mutable: true }) value = '';
  @Prop() type = 'text';
  @Prop() placeholder = '';
  @Prop() disabled = false;
  @Prop() error = '';
  /** Optional leading icon */
  @Prop() icon?: 'mail' | 'lock' | 'user' | 'search';
  /** Extra classes for the inner <input>, e.g. "form-control" (Bootstrap) */
  @Prop() inputClass = '';

  /** Emits the new value on every keystroke */
  @Event() evokeInput!: EventEmitter<string>;
  /** Emits the new value on commit (blur/enter) */
  @Event() evokeChange!: EventEmitter<string>;

  private inputId = `evoke-input-${Math.random().toString(36).slice(2, 9)}`;

  render() {
    const iconPaths = this.icon ? ICONS[this.icon] : undefined;
    return (
      <div class="evoke-field">
        {this.label && <label htmlFor={this.inputId} class="evoke-field__label">{this.label}</label>}
        <div class="evoke-field__control">
          {iconPaths && (
            <svg class="evoke-field__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              {iconPaths.map((d) => <path d={d} />)}
            </svg>
          )}
          <input
            id={this.inputId}
            class={`evoke-field__input ${iconPaths ? 'evoke-field__input--icon' : ''} ${this.error ? 'evoke-field__input--error' : ''} ${this.inputClass}`.trim()}
            type={this.type}
            value={this.value}
            placeholder={this.placeholder}
            disabled={this.disabled}
            aria-invalid={this.error ? 'true' : undefined}
            onInput={(e) => {
              this.value = (e.target as HTMLInputElement).value;
              this.evokeInput.emit(this.value);
            }}
            onChange={(e) => this.evokeChange.emit((e.target as HTMLInputElement).value)}
          />
        </div>
        {this.error && <span class="evoke-field__error" role="alert">{this.error}</span>}
      </div>
    );
  }
}
