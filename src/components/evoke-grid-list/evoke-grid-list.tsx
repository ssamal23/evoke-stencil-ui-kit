import { Component, Prop, h } from '@stencil/core';

@Component({ tag: 'evoke-grid-list', styleUrl: 'evoke-grid-list.css', shadow: false })
export class EvokeGridList {
  /** Number of columns. With 0 the columns fit as many as the width allows (see `minItemWidth`). */
  @Prop() columns = 0;
  /** Smallest width of an item when `columns` is 0, e.g. "160px" */
  @Prop() minItemWidth = '160px';
  /** Space between items, any CSS length */
  @Prop() gap = '16px';
  /** Fixed height of each row, any CSS length. Empty: rows grow with their content. */
  @Prop() rowHeight = '';

  render() {
    const template = this.columns > 0 ? `repeat(${this.columns}, minmax(0, 1fr))` : `repeat(auto-fill, minmax(min(${this.minItemWidth}, 100%), 1fr))`;
    return (
      <div class="evoke-grid-list" role="list" style={{ gridTemplateColumns: template, gap: this.gap, gridAutoRows: this.rowHeight || 'auto' }}>
        <slot />
      </div>
    );
  }
}
