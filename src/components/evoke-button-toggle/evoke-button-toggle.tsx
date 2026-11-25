import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';
import { EvokeListItem, parseListItems, toValues } from '../../utils/list-items';
import { renderIcon } from '../../utils/icons';

@Component({ tag: 'evoke-button-toggle', styleUrl: 'evoke-button-toggle.css', shadow: false })
export class EvokeButtonToggle {
  /** Buttons as an array of { label, value, icon?, disabled? } or a JSON string of the same */
  @Prop() items: EvokeListItem[] | string = [];
  /** Selected value, or an array of values when `multiple` */
  @Prop({ mutable: true }) value: string | string[] = '';
  /** Allow several buttons to be on at once (checkbox style). Otherwise one is on (radio style). */
  @Prop() multiple = false;
  /** Accessible name for the group */
  @Prop() label = '';
  @Prop() disabled = false;

  /** Emits the selected value, or the selected values (string[]) when `multiple` */
  @Event() evokeChange!: EventEmitter<string | string[]>;

  private choose(item: EvokeListItem) {
    if (this.disabled || item.disabled) return;
    const cur = toValues(this.value, this.multiple);
    if (this.multiple) {
      const next = cur.includes(item.value) ? cur.filter((v) => v !== item.value) : [...cur, item.value];
      this.value = next;
      this.evokeChange.emit(next);
    } else if (!cur.includes(item.value)) {
      this.value = item.value;
      this.evokeChange.emit(item.value);
    }
  }

  render() {
    const selected = toValues(this.value, this.multiple);
    return (
      <div class="evoke-button-toggle" role="group" aria-label={this.label || undefined}>
        {parseListItems(this.items).map((item) => {
          const on = selected.includes(item.value);
          return (
            <button
              type="button"
              class={`evoke-button-toggle__btn ${on ? 'evoke-button-toggle__btn--on' : ''}`.trim()}
              aria-pressed={on ? 'true' : 'false'}
              disabled={this.disabled || item.disabled}
              onClick={() => this.choose(item)}
            >
              {on && this.multiple && renderIcon('check', 'evoke-icon evoke-button-toggle__check')}
              {item.icon && renderIcon(item.icon, 'evoke-icon evoke-button-toggle__icon')}
              {item.label}
            </button>
          );
        })}
      </div>
    );
  }
}
