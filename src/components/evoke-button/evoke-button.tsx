import { Component, Prop, h } from '@stencil/core';
import { EvokeIcon, renderIcon } from '../../utils/icons';

@Component({ tag: 'evoke-button', styleUrl: 'evoke-button.css', shadow: false })
export class EvokeButton {
  /** Solid variants (primary, secondary, danger), outline, or ghost (text only, no border) */
  @Prop() variant: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' = 'primary';
  @Prop() size: 'sm' | 'md' | 'lg' = 'md';
  @Prop() type: 'button' | 'submit' | 'reset' = 'button';
  @Prop() disabled = false;
  /** Shows a spinner and blocks clicks while true */
  @Prop() loading = false;
  /** Optional leading icon */
  @Prop() icon?: EvokeIcon;
  /** Square button for icon-only use; set `accessible-label` too */
  @Prop({ reflect: true }) iconOnly = false;
  /** aria-label for the inner button (required when `icon-only`) */
  @Prop() accessibleLabel?: string;
  /** Stretch to the full width of the container */
  @Prop({ reflect: true }) block = false;
  /** Extra classes for the inner <button>, e.g. "btn btn-lg" (Bootstrap) or "shadow-lg" (Tailwind) */
  @Prop() buttonClass = '';

  render() {
    const cls = `evoke-btn evoke-btn--${this.variant} evoke-btn--${this.size} ${this.iconOnly ? 'evoke-btn--icon' : ''} ${this.loading ? 'evoke-btn--loading' : ''} ${this.buttonClass}`;
    return (
      <button
        type={this.type}
        class={cls.replace(/\s+/g, ' ').trim()}
        disabled={this.disabled || this.loading}
        aria-busy={this.loading ? 'true' : undefined}
        aria-label={this.accessibleLabel}
      >
        {this.loading ? <span class="evoke-spinner" aria-hidden="true" /> : renderIcon(this.icon)}
        <slot />
      </button>
    );
  }
}
