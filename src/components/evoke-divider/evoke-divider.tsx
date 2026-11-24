import { Component, Prop, h } from '@stencil/core';

@Component({ tag: 'evoke-divider', styleUrl: 'evoke-divider.css', shadow: false })
export class EvokeDivider {
  /** Vertical line. Use it inside a flex row. */
  @Prop({ reflect: true }) vertical = false;
  /** Full width, or indented from the start edge (like the divider between list items) */
  @Prop() appearance: 'full' | 'inset' = 'full';

  render() {
    const cls = `evoke-divider evoke-divider--${this.appearance} ${this.vertical ? 'evoke-divider--vertical' : ''}`.trim();
    return <div class={cls} role="separator" aria-orientation={this.vertical ? 'vertical' : 'horizontal'} />;
  }
}
