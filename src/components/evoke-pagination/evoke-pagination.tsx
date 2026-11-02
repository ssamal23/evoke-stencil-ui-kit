import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';
import { renderIcon } from '../../utils/icons';

@Component({ tag: 'evoke-pagination', styleUrl: 'evoke-pagination.css', shadow: false })
export class EvokePagination {
  /** Current page (1-based) */
  @Prop({ mutable: true }) page = 1;
  /** Total number of pages */
  @Prop() total = 1;
  /** Numbered pages, or compact (Prev, "2 of 10", Next) */
  @Prop() appearance: 'numbered' | 'compact' = 'numbered';
  @Prop() disabled = false;

  /** Emits the new page number */
  @Event() evokeChange!: EventEmitter<number>;

  private go(p: number) {
    const next = Math.min(Math.max(p, 1), Math.max(this.total, 1));
    if (this.disabled || next === this.page) return;
    this.page = next;
    this.evokeChange.emit(next);
  }

  private pages(): (number | '…')[] {
    const t = this.total, p = this.page;
    if (t <= 7) return Array.from({ length: t }, (_, i) => i + 1);
    const out: (number | '…')[] = [1];
    const start = Math.max(2, p - 1);
    const end = Math.min(t - 1, p + 1);
    if (start > 2) out.push('…');
    for (let i = start; i <= end; i++) out.push(i);
    if (end < t - 1) out.push('…');
    out.push(t);
    return out;
  }

  render() {
    const prevOff = this.disabled || this.page <= 1;
    const nextOff = this.disabled || this.page >= this.total;
    const prev = (
      <button type="button" class="evoke-pager__btn evoke-pager__nav" aria-label="Previous page" disabled={prevOff} onClick={() => this.go(this.page - 1)}>
        {renderIcon('chevron-left', 'evoke-icon')}{this.appearance === 'compact' && <span>Prev</span>}
      </button>
    );
    const next = (
      <button type="button" class="evoke-pager__btn evoke-pager__nav" aria-label="Next page" disabled={nextOff} onClick={() => this.go(this.page + 1)}>
        {this.appearance === 'compact' && <span>Next</span>}{renderIcon('chevron-right', 'evoke-icon')}
      </button>
    );

    return (
      <nav class={`evoke-pager evoke-pager--${this.appearance}`} aria-label="Pagination">
        {prev}
        {this.appearance === 'compact' ? (
          <span class="evoke-pager__status" aria-live="polite">{this.page} of {this.total}</span>
        ) : (
          this.pages().map((p) =>
            p === '…' ? (
              <span class="evoke-pager__gap" aria-hidden="true">…</span>
            ) : (
              <button
                type="button"
                class={`evoke-pager__btn ${p === this.page ? 'evoke-pager__btn--active' : ''}`.trim()}
                aria-label={`Page ${p}`}
                aria-current={p === this.page ? 'page' : undefined}
                disabled={this.disabled}
                onClick={() => this.go(p)}
              >
                {p}
              </button>
            ),
          )
        )}
        {next}
      </nav>
    );
  }
}
