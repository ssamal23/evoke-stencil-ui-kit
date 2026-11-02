import { Component, Element, Prop, Event, EventEmitter, h } from '@stencil/core';
import { EvokeOption, parseOptions } from '../../utils/options';

@Component({ tag: 'evoke-tabs', styleUrl: 'evoke-tabs.css', shadow: false })
export class EvokeTabs {
  @Element() el!: HTMLElement;

  /** Tabs as an array of { label, value, disabled? } or a JSON string of the same */
  @Prop() options: EvokeOption[] | string = [];
  /** Value of the active tab. Defaults to the first enabled tab. */
  @Prop({ mutable: true }) value = '';
  /** Underline tabs or pill tabs */
  @Prop() appearance: 'underline' | 'pill' = 'underline';
  /** Accessible name for the tab list */
  @Prop() label = '';

  /** Emits the value of the newly selected tab */
  @Event() evokeChange!: EventEmitter<string>;

  private uid = Math.random().toString(36).slice(2, 9);

  private get tabs() {
    return parseOptions(this.options);
  }

  private get activeValue() {
    const tabs = this.tabs;
    return tabs.some((t) => t.value === this.value && !t.disabled) ? this.value : tabs.find((t) => !t.disabled)?.value ?? '';
  }

  private select(v: string) {
    if (v === this.value) return;
    this.value = v;
    this.evokeChange.emit(v);
  }

  private onKeyDown = (e: KeyboardEvent) => {
    const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End'];
    if (!keys.includes(e.key)) return;
    const tabs = this.tabs;
    const enabled = tabs.map((t, i) => (t.disabled ? -1 : i)).filter((i) => i >= 0);
    if (enabled.length === 0) return;
    e.preventDefault();
    const cur = tabs.findIndex((t) => t.value === this.activeValue);
    const pos = enabled.indexOf(cur);
    let next = enabled[0];
    if (e.key === 'ArrowRight') next = enabled[(pos + 1) % enabled.length];
    else if (e.key === 'ArrowLeft') next = enabled[(pos - 1 + enabled.length) % enabled.length];
    else if (e.key === 'End') next = enabled[enabled.length - 1];
    const btn = this.el.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next];
    btn?.focus();
    this.select(tabs[next].value);
  };

  render() {
    const active = this.activeValue;
    return (
      <div class={`evoke-tabs evoke-tabs--${this.appearance}`}>
        <div class="evoke-tabs__list" role="tablist" aria-label={this.label || undefined} onKeyDown={this.onKeyDown}>
          {this.tabs.map((t) => {
            const on = t.value === active;
            return (
              <button
                type="button"
                role="tab"
                id={`evoke-tab-${this.uid}-${t.value}`}
                class={`evoke-tabs__tab ${on ? 'evoke-tabs__tab--active' : ''}`.trim()}
                aria-selected={on ? 'true' : 'false'}
                aria-controls={`evoke-panel-${this.uid}`}
                tabindex={on ? 0 : -1}
                disabled={t.disabled}
                onClick={() => this.select(t.value)}
              >
                {t.label}
              </button>
            );
          })}
        </div>
        <div class="evoke-tabs__panel" role="tabpanel" id={`evoke-panel-${this.uid}`} aria-labelledby={active ? `evoke-tab-${this.uid}-${active}` : undefined} tabindex={0}>
          <slot />
        </div>
      </div>
    );
  }
}
