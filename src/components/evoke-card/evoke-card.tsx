import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';

@Component({ tag: 'evoke-card', styleUrl: 'evoke-card.css', shadow: false })
export class EvokeCard {
  @Prop() heading = '';
  /** Outlined (border) or elevated (shadow, no border) */
  @Prop() appearance: 'outlined' | 'elevated' = 'outlined';
  /** Makes the whole card a button (hover/active/focus states, Enter/Space) */
  @Prop() clickable = false;
  /** Extra classes for the card container, e.g. "shadow-md" (Tailwind) or "card" (Bootstrap) */
  @Prop() cardClass = '';

  /** Fired when a `clickable` card is activated */
  @Event() evokeClick!: EventEmitter<void>;

  private activate = () => {
    if (this.clickable) this.evokeClick.emit();
  };

  private onKeyDown = (e: KeyboardEvent) => {
    if (!this.clickable || e.target !== e.currentTarget) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.activate();
    }
  };

  render() {
    return (
      <div
        class={`evoke-card evoke-card--${this.appearance} ${this.clickable ? 'evoke-card--clickable' : ''} ${this.cardClass}`.replace(/\s+/g, ' ').trim()}
        role={this.clickable ? 'button' : undefined}
        tabindex={this.clickable ? 0 : undefined}
        onClick={this.activate}
        onKeyDown={this.onKeyDown}
      >
        <div class="evoke-card__media"><slot name="media" /></div>
        {this.heading && <div class="evoke-card__header">{this.heading}</div>}
        <div class="evoke-card__body"><slot /></div>
      </div>
    );
  }
}
