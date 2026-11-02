import { Component, Prop, h } from '@stencil/core';

/**
 * @slot logo - brand/logo on the left
 * @slot nav - navigation links in the middle (wrapped in a <nav>)
 * @slot actions - buttons, badges or icons on the right
 */
@Component({ tag: 'evoke-app-bar', styleUrl: 'evoke-app-bar.css', shadow: false })
export class EvokeAppBar {
  /** Light surface, or dark / brand-coloured (navy) */
  @Prop() appearance: 'light' | 'dark' = 'light';
  /** Stick to the top of the viewport while scrolling */
  @Prop({ reflect: true }) sticky = false;
  /** Accessible name for the navigation landmark */
  @Prop() navLabel = 'Main';

  render() {
    return (
      <header class={`evoke-appbar evoke-appbar--${this.appearance}`}>
        <div class="evoke-appbar__logo"><slot name="logo" /></div>
        <nav class="evoke-appbar__nav" aria-label={this.navLabel}><slot name="nav" /></nav>
        <div class="evoke-appbar__actions"><slot name="actions" /></div>
      </header>
    );
  }
}
