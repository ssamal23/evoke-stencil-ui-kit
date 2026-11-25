import { Component, Element, Prop, State, Event, EventEmitter, Listen, h } from '@stencil/core';
import { EvokeMenuOption, parseMenuOptions } from '../../utils/list-items';
import { renderIcon } from '../../utils/icons';

@Component({ tag: 'evoke-menu', styleUrl: 'evoke-menu.css', shadow: false })
export class EvokeMenu {
  @Element() el!: HTMLElement;

  /** Text of the button that opens the menu */
  @Prop() label = 'Menu';
  /** Menu items as an array of { label, value, icon?, disabled?, divider? } or a JSON string of the same */
  @Prop() options: EvokeMenuOption[] | string = [];
  /** Line the menu up with the left edge of the button (default) or the right edge */
  @Prop() align: 'start' | 'end' = 'start';
  @Prop() disabled = false;

  /** Emits the value of the chosen item */
  @Event() evokeSelect!: EventEmitter<string>;

  @State() isOpen = false;

  private uid = Math.random().toString(36).slice(2, 9);
  private triggerEl?: HTMLButtonElement;
  private focusFirst = false;

  @Listen('click', { target: 'document' })
  onDocClick(e: MouseEvent) {
    if (this.isOpen && !this.el.contains(e.target as Node)) this.close(false);
  }

  componentDidRender() {
    if (this.isOpen && this.focusFirst) {
      this.focusFirst = false;
      this.items()[0]?.focus();
    }
  }

  private items() {
    return Array.from(this.el.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])'));
  }

  private open(focusFirst: boolean) {
    if (this.disabled) return;
    this.focusFirst = focusFirst;
    this.isOpen = true;
  }

  private close(refocus = true) {
    this.isOpen = false;
    if (refocus) this.triggerEl?.focus();
  }

  private pick(o: EvokeMenuOption) {
    if (o.disabled) return;
    this.evokeSelect.emit(o.value ?? o.label ?? '');
    this.close();
  }

  private onTriggerKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); this.open(true); }
  };

  private onMenuKey = (e: KeyboardEvent) => {
    const items = this.items();
    if (!items.length) return;
    const i = items.indexOf(document.activeElement as HTMLElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
    else if (e.key === 'Home') { e.preventDefault(); items[0].focus(); }
    else if (e.key === 'End') { e.preventDefault(); items[items.length - 1].focus(); }
    else if (e.key === 'Escape') { e.preventDefault(); this.close(); }
    else if (e.key === 'Tab') this.close(false);
  };

  render() {
    const menuId = `evoke-menu-${this.uid}`;
    return (
      <div class="evoke-menu">
        <button
          type="button"
          class="evoke-menu__trigger"
          aria-haspopup="menu"
          aria-expanded={this.isOpen ? 'true' : 'false'}
          aria-controls={this.isOpen ? menuId : undefined}
          disabled={this.disabled}
          ref={(el) => (this.triggerEl = el)}
          onClick={() => (this.isOpen ? this.close() : this.open(false))}
          onKeyDown={this.onTriggerKey}
        >
          {this.label}
          {renderIcon('chevron-down', 'evoke-icon evoke-menu__chevron')}
        </button>
        {this.isOpen && (
          <div id={menuId} class={`evoke-menu__panel evoke-menu__panel--${this.align}`} role="menu" aria-label={this.label} onKeyDown={this.onMenuKey}>
            {parseMenuOptions(this.options).map((o) =>
              o.divider ? (
                <div class="evoke-menu__divider" role="separator" />
              ) : (
                <button
                  type="button"
                  role="menuitem"
                  class="evoke-menu__item"
                  tabindex={-1}
                  aria-disabled={o.disabled ? 'true' : undefined}
                  onClick={() => this.pick(o)}
                >
                  {o.icon && renderIcon(o.icon, 'evoke-icon evoke-menu__icon')}
                  {o.label}
                </button>
              ),
            )}
          </div>
        )}
      </div>
    );
  }
}
