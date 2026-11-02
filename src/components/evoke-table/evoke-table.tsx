import { Component, Prop, State, Event, EventEmitter, h } from '@stencil/core';
import { renderIcon } from '../../utils/icons';

@Component({ tag: 'evoke-table', styleUrl: 'evoke-table.css', shadow: false })
export class EvokeTable {
  /** Columns as an array of { key, label, sortable?, align? } or a JSON string of the same */
  @Prop() columns: { key: string; label: string; sortable?: boolean; align?: 'left' | 'center' | 'right' }[] | string = [];
  /** Rows as an array of objects keyed by column key, or a JSON string of the same */
  @Prop() rows: Record<string, string | number | boolean | null>[] | string = [];
  /** Alternate row shading */
  @Prop() striped = false;
  /** Allow sorting on columns marked `sortable` (or all columns if none are marked) */
  @Prop() sortable = false;
  /** Visually hidden/visible table caption for screen readers */
  @Prop() caption = '';
  @Prop() emptyText = 'No data';

  /** Fired after a header is sorted: { key, direction } where direction is 'asc' or 'desc' */
  @Event() evokeSort!: EventEmitter<{ key: string; direction: 'asc' | 'desc' }>;

  @State() sortKey = '';
  @State() sortDir: 'asc' | 'desc' = 'asc';

  private parse<T>(v: T[] | string): T[] {
    if (Array.isArray(v)) return v;
    try {
      const p = JSON.parse(v);
      return Array.isArray(p) ? p : [];
    } catch {
      return [];
    }
  }

  private toggleSort(key: string) {
    this.sortDir = this.sortKey === key && this.sortDir === 'asc' ? 'desc' : 'asc';
    this.sortKey = key;
    this.evokeSort.emit({ key, direction: this.sortDir });
  }

  render() {
    const cols = this.parse(this.columns);
    const anyMarked = cols.some((c) => c.sortable);
    const isSortable = (c: { sortable?: boolean }) => this.sortable && (anyMarked ? !!c.sortable : true);
    let rows = [...this.parse(this.rows)];
    if (this.sortKey) {
      const k = this.sortKey;
      const dir = this.sortDir === 'asc' ? 1 : -1;
      rows.sort((a, b) => {
        const x = a[k], y = b[k];
        if (x == null) return 1;
        if (y == null) return -1;
        return (typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), undefined, { numeric: true })) * dir;
      });
    }

    return (
      <div class="evoke-table__wrap">
        <table class={`evoke-table ${this.striped ? 'evoke-table--striped' : ''}`.trim()}>
          {this.caption && <caption class="evoke-table__caption">{this.caption}</caption>}
          <thead>
            <tr>
              {cols.map((c) => {
                const active = this.sortKey === c.key;
                return (
                  <th
                    scope="col"
                    class={`evoke-table__th evoke-table__cell--${c.align ?? 'left'}`}
                    aria-sort={isSortable(c) ? (active ? (this.sortDir === 'asc' ? 'ascending' : 'descending') : 'none') : undefined}
                  >
                    {isSortable(c) ? (
                      <button type="button" class="evoke-table__sort" onClick={() => this.toggleSort(c.key)}>
                        {c.label}
                        {renderIcon(active ? (this.sortDir === 'asc' ? 'arrow-up' : 'arrow-down') : 'sort', `evoke-table__sort-icon ${active ? 'evoke-table__sort-icon--active' : ''}`.trim())}
                      </button>
                    ) : (
                      c.label
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td class="evoke-table__empty" colSpan={Math.max(cols.length, 1)}>{this.emptyText}</td></tr>
            ) : (
              rows.map((r) => (
                <tr class="evoke-table__row">
                  {cols.map((c) => <td class={`evoke-table__td evoke-table__cell--${c.align ?? 'left'}`}>{r[c.key] == null ? '' : String(r[c.key])}</td>)}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  }
}
