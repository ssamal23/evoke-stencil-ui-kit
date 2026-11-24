import { Component, Element, Prop, Event, EventEmitter, Listen, Watch, h } from '@stencil/core';
import { renderIcon } from '../../utils/icons';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

@Component({ tag: 'evoke-sidenav', styleUrl: 'evoke-sidenav.css', shadow: false })
export class EvokeSidenav {
  @Element() el!: HTMLElement;

  /** Whether the side panel is visible */
  @Prop({ mutable: true, reflect: true }) open = false;
  /** over: slides over the page with a backdrop (like a drawer). side: sits in the page next to your content. */
  @Prop() mode: 'over' | 'side' = 'over';
  @Prop() position: 'start' | 'end' = 'start';
  /** Optional title in the panel header */
  @Prop() heading = '';
  /** Accessible name when there is no heading */
  @Prop() label = 'Navigation';
  @Prop() closeOnBackdrop = true;

  /** Fired when the panel asks to close (backdrop, Esc, or the close button) */
  @Event() evokeClose!: EventEmitter<void>;

  private panel?: HTMLElement;
  private previouslyFocused: HTMLElement | null = null;
  private previousOverflow = '';
  private locked = false;
  private pendingFocus = false;

  @Watch('open')
  onOpenChange(next: boolean, prev: boolean) {
    if (next && !prev) this.onOpened();
    else if (!next && prev) this.onClosed();
  }

  @Watch('mode')
  onModeChange() {
    if (this.mode === 'side' && this.locked) this.unlock();
    else if (this.mode === 'over' && this.open) this.onOpened();
  }

  componentDidLoad() {
    if (this.open) this.onOpened();
  }

  disconnectedCallback() {
    if (this.locked) this.unlock();
  }

  componentDidRender() {
    if (this.pendingFocus && this.panel) {
      this.pendingFocus = false;
      (this.focusables()[0] ?? this.panel).focus();
    }
  }

  private onOpened() {
    if (this.mode !== 'over') return;
    this.previouslyFocused = document.activeElement as HTMLElement | null;
    this.pendingFocus = true;
    if (!this.locked) {
      this.previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      this.locked = true;
    }
  }

  private onClosed() {
    if (this.locked) this.unlock();
    this.previouslyFocused?.focus?.();
    this.previouslyFocused = null;
  }

  private unlock() {
    document.body.style.overflow = this.previousOverflow;
    this.locked = false;
  }

  private focusables(): HTMLElement[] {
    return this.panel ? Array.from(this.panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((n) => n.offsetParent !== null) : [];
  }

  private close() {
    this.open = false;
    this.evokeClose.emit();
  }

  @Listen('keydown', { target: 'window' })
  onKeydown(e: KeyboardEvent) {
    if (!this.open) return;
    if (e.key === 'Escape' && (this.mode === 'over' || this.el.contains(document.activeElement))) {
      e.preventDefault();
      return this.close();
    }
    if (e.key !== 'Tab' || !this.panel || this.mode !== 'over') return;
    const items = this.focusables();
    if (items.length === 0) {
      e.preventDefault();
      return this.panel.focus();
    }
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || active === this.panel)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  }

  private renderPanel() {
    return (
      <aside
        class={`evoke-sidenav evoke-sidenav--${this.position} evoke-sidenav--${this.mode}`}
        role={this.mode === 'over' ? 'dialog' : 'complementary'}
        aria-modal={this.mode === 'over' ? 'true' : undefined}
        aria-label={this.heading || this.label}
        tabindex={-1}
        ref={(el) => (this.panel = el)}
        onClick={(e) => e.stopPropagation()}
      >
        {(this.heading || this.mode === 'over') && (
          <div class="evoke-sidenav__header">
            <span>{this.heading}</span>
            <button type="button" class="evoke-sidenav__close" aria-label="Close" onClick={() => this.close()}>
              {renderIcon('x', 'evoke-icon')}
            </button>
          </div>
        )}
        <div class="evoke-sidenav__body"><slot /></div>
      </aside>
    );
  }

  render() {
    if (!this.open) return null;
    if (this.mode === 'side') return this.renderPanel();
    return (
      <div class={`evoke-sidenav__backdrop evoke-sidenav__backdrop--${this.position}`} onClick={() => this.closeOnBackdrop && this.close()}>
        {this.renderPanel()}
      </div>
    );
  }
}
