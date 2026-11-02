import { Component, Element, Prop, h } from '@stencil/core';

@Component({ tag: 'evoke-badge', styleUrl: 'evoke-badge.css', shadow: false })
export class EvokeBadge {
  @Element() el!: HTMLElement;

  /** Number to show (count badge) */
  @Prop() count = 0;
  /** Counts above this show as "max+" (e.g. 99+) */
  @Prop() max = 99;
  /** Show a small status dot instead of a number */
  @Prop() dot = false;
  /** Show the badge even when the count is 0 */
  @Prop() showZero = false;
  @Prop() color: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info' = 'danger';
  /** Screen-reader text, e.g. "3 items in cart". A dot without a label is treated as decorative. */
  @Prop() label = '';

  private hasContent = false;

  componentWillLoad() {
    this.hasContent = Array.from(this.el.childNodes).some((n) => n.nodeType === 1 || (n.nodeType === 3 && !!n.textContent?.trim()));
  }

  render() {
    const text = this.count > this.max ? `${this.max}+` : String(this.count);
    const showCount = !this.dot && (this.count > 0 || this.showZero);
    const bubble = this.dot ? (
      <span class={`evoke-badge evoke-badge--dot evoke-badge--${this.color}`} role={this.label ? 'status' : undefined} aria-label={this.label || undefined} aria-hidden={this.label ? undefined : 'true'} />
    ) : showCount ? (
      <span class={`evoke-badge evoke-badge--count evoke-badge--${this.color}`}>
        <span aria-hidden={this.label ? 'true' : undefined}>{text}</span>
        {this.label && <span class="evoke-badge__sr">{this.label}</span>}
      </span>
    ) : null;

    return (
      <span class={`evoke-badge-wrap ${this.hasContent ? 'evoke-badge-wrap--anchored' : ''}`.trim()}>
        <slot />
        {bubble}
      </span>
    );
  }
}
