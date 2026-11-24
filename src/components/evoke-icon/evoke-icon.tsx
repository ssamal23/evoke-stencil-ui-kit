import { Component, Prop, h } from '@stencil/core';
import { EvokeIcon, renderIcon } from '../../utils/icons';

@Component({ tag: 'evoke-icon', styleUrl: 'evoke-icon.css', shadow: false })
export class EvokeIconComponent {
  /** Icon name: mail, lock, user, search, plus, minus, check, x, chevron-down, chevron-up, chevron-left, chevron-right, arrow-right, arrow-up, arrow-down, sort, cart, info, alert */
  @Prop() name!: EvokeIcon;
  /** sm 16px, md 20px, lg 24px, xl 32px. Any other size: set the CSS variable --evoke-icon-size. */
  @Prop() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  /** Accessible name. Leave empty when the icon is decoration beside text. */
  @Prop() label = '';

  render() {
    return (
      <span class={`evoke-icon-wrap evoke-icon-wrap--${this.size}`} role={this.label ? 'img' : undefined} aria-label={this.label || undefined} aria-hidden={this.label ? undefined : 'true'}>
        {renderIcon(this.name, 'evoke-icon')}
      </span>
    );
  }
}
