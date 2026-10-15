import { Component, Prop, h } from '@stencil/core';

@Component({ tag: 'evoke-card', styleUrl: 'evoke-card.css', shadow: false })
export class EvokeCard {
  @Prop() heading = '';
  /** Extra classes for the card container, e.g. "shadow-md" (Tailwind) or "card" (Bootstrap) */
  @Prop() cardClass = '';

  render() {
    return (
      <div class={`evoke-card ${this.cardClass}`.trim()}>
        {this.heading && <div class="evoke-card__header">{this.heading}</div>}
        <div class="evoke-card__body"><slot /></div>
      </div>
    );
  }
}
