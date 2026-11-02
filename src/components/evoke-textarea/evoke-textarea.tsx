import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';

@Component({ tag: 'evoke-textarea', styleUrl: 'evoke-textarea.css', shadow: false })
export class EvokeTextarea {
  @Prop() label = '';
  @Prop({ mutable: true }) value = '';
  @Prop() name = '';
  @Prop() placeholder = '';
  /** Visible rows (the minimum height when `auto-grow` is on) */
  @Prop() rows = 4;
  /** Grow with the content instead of scrolling */
  @Prop() autoGrow = false;
  /** Max characters; also shows a live "n / max" counter */
  @Prop() maxLength?: number;
  @Prop() disabled = false;
  @Prop() required = false;
  @Prop() error = '';
  @Prop() hint = '';
  /** Extra classes for the inner <textarea> */
  @Prop() textareaClass = '';

  /** Emits the new value on every keystroke */
  @Event() evokeInput!: EventEmitter<string>;
  /** Emits the new value on commit (blur) */
  @Event() evokeChange!: EventEmitter<string>;

  private el?: HTMLTextAreaElement;
  private uid = Math.random().toString(36).slice(2, 9);

  componentDidRender() {
    this.resize();
  }

  private resize() {
    if (!this.autoGrow || !this.el) return;
    this.el.style.height = 'auto';
    this.el.style.height = `${this.el.scrollHeight}px`;
  }

  render() {
    const id = `evoke-textarea-${this.uid}`;
    const msgId = `${id}-msg`;
    const len = (this.value ?? '').length;
    const hasMax = typeof this.maxLength === 'number' && this.maxLength > 0;
    return (
      <div class="evoke-field">
        {this.label && <label htmlFor={id} class="evoke-field__label">{this.label}{this.required && <span aria-hidden="true"> *</span>}</label>}
        <textarea
          id={id}
          class={`evoke-field__input evoke-field__textarea ${this.autoGrow ? 'evoke-field__textarea--auto' : ''} ${this.error ? 'evoke-field__input--error' : ''} ${this.textareaClass}`.replace(/\s+/g, ' ').trim()}
          name={this.name || undefined}
          rows={this.rows}
          maxLength={hasMax ? this.maxLength : undefined}
          placeholder={this.placeholder}
          disabled={this.disabled}
          required={this.required}
          value={this.value}
          aria-invalid={this.error ? 'true' : undefined}
          aria-describedby={this.error || this.hint ? msgId : undefined}
          ref={(el) => (this.el = el)}
          onInput={(e) => {
            this.value = (e.target as HTMLTextAreaElement).value;
            this.resize();
            this.evokeInput.emit(this.value);
          }}
          onChange={(e) => this.evokeChange.emit((e.target as HTMLTextAreaElement).value)}
        />
        <div class="evoke-field__footer">
          {this.error ? (
            <span id={msgId} class="evoke-field__error" role="alert">{this.error}</span>
          ) : (
            <span id={msgId} class="evoke-field__hint">{this.hint}</span>
          )}
          {hasMax && <span class={`evoke-field__counter ${len >= this.maxLength! ? 'evoke-field__counter--full' : ''}`.trim()} aria-live="polite">{len} / {this.maxLength}</span>}
        </div>
      </div>
    );
  }
}
