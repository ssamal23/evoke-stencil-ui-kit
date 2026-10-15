import { Component, Prop, h } from '@stencil/core';

@Component({ tag: 'evoke-button', styleUrl: 'evoke-button.css', shadow: false })
export class EvokeButton {
  /** Visual variant */
  @Prop() variant: 'primary' | 'secondary' | 'danger' | 'outline' = 'primary';
  @Prop() type: 'button' | 'submit' | 'reset' = 'button';
  @Prop() disabled = false;
  /** Stretch to the full width of the container */
  @Prop({ reflect: true }) block = false;
  /** Extra classes for the inner <button>, e.g. "btn btn-lg" (Bootstrap) or "shadow-lg" (Tailwind) */
  @Prop() buttonClass = '';

  render() {
    return (
      <button type={this.type} disabled={this.disabled} class={`evoke-btn evoke-btn--${this.variant} ${this.buttonClass}`.trim()}>
        <slot />
      </button>
    );
  }
}
