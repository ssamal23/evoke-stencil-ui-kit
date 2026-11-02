import { Component, Element, Prop, State, h } from '@stencil/core';

@Component({ tag: 'evoke-tooltip', styleUrl: 'evoke-tooltip.css', shadow: false })
export class EvokeTooltip {
  @Element() el!: HTMLElement;

  @Prop() text = '';
  @Prop() placement: 'top' | 'bottom' | 'left' | 'right' = 'top';
  /** Dark, or light with an arrow */
  @Prop() theme: 'dark' | 'light' = 'dark';

  @State() visible = false;

  private id = `evoke-tip-${Math.random().toString(36).slice(2, 9)}`;

  private observer?: MutationObserver;

  componentDidLoad() {
    this.link();
    // Slotted components (e.g. <evoke-button>) render their inner <button> later, so keep linking
    this.observer = new MutationObserver(() => this.link());
    this.observer.observe(this.el, { childList: true, subtree: true });
  }

  disconnectedCallback() {
    this.observer?.disconnect();
  }

  /** Point every focusable element inside the trigger at the tooltip text (aria-describedby) */
  private link() {
    const targets = this.el.querySelectorAll<HTMLElement>('button, a[href], input, select, textarea, [tabindex]');
    targets.forEach((t) => {
      if (t.closest('.evoke-tooltip__bubble')) return;
      const ids = (t.getAttribute('aria-describedby') ?? '').split(' ').filter(Boolean);
      if (!ids.includes(this.id)) t.setAttribute('aria-describedby', [...ids, this.id].join(' '));
    });
  }

  private show = () => (this.visible = true);
  private hide = () => (this.visible = false);

  render() {
    return (
      <span
        class="evoke-tooltip"
        onMouseEnter={this.show}
        onMouseLeave={this.hide}
        onFocusin={this.show}
        onFocusout={this.hide}
        onKeyDown={(e: KeyboardEvent) => e.key === 'Escape' && this.hide()}
      >
        <slot />
        <span
          id={this.id}
          role="tooltip"
          class={`evoke-tooltip__bubble evoke-tooltip__bubble--${this.placement} evoke-tooltip__bubble--${this.theme} ${this.visible ? 'evoke-tooltip__bubble--visible' : ''}`.trim()}
        >
          {this.text}
        </span>
      </span>
    );
  }
}
