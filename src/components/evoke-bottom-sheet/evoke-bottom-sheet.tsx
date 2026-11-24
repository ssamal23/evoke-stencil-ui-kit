import { Component, Element, Prop, Event, EventEmitter, Listen, Watch, h } from '@stencil/core';
import { renderIcon } from '../../utils/icons';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

@Component({ tag: 'evoke-bottom-sheet', styleUrl: 'evoke-bottom-sheet.css', shadow: false })
export class EvokeBottomSheet {
  @Element() el!: HTMLElement;

  /** Whether the sheet is visible */
  @Prop({ mutable: true, reflect: true }) open = false;
  @Prop() heading = '';
  @Prop() closeOnBackdrop = true;

  /** Fired when the sheet asks to close (backdrop, Esc, or the close button) */
  @Event() evokeClose!: EventEmitter<void>;

  private panel?: HTMLElement;
  private previouslyFocused: HTMLElement | null = null;
  private previousOverflow = '';
  private locked = false;
  private pendingFocus = false;
  private uid = Math.random().toString(36).slice(2, 9);

  @Watch('open')
  onOpenChange(next: boolean, prev: boolean) {
    if (next && !prev) this.onOpened();
    else if (!next && prev) this.onClosed();
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
    this.previouslyFocused = document.activeElement as HTMLElement | null;
    this.pendingFocus = true;
    if (!this.locked) {
      this.previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      this.locked = true;
    }
  }

  private onClosed() {
    this.unlock();
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
    if (e.key === 'Escape') {
      e.preventDefault();
      return this.close();
    }
    if (e.key !== 'Tab' || !this.panel) return;
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

  render() {
    if (!this.open) return null;
    const titleId = `evoke-bottom-sheet-${this.uid}-title`;
    return (
      <div class="evoke-sheet__backdrop" onClick={() => this.closeOnBackdrop && this.close()}>
        <div
          class="evoke-sheet"
          role="dialog"
          aria-modal="true"
          aria-labelledby={this.heading ? titleId : undefined}
          tabindex={-1}
          ref={(el) => (this.panel = el)}
          onClick={(e) => e.stopPropagation()}
        >
          <div class="evoke-sheet__grip" aria-hidden="true" />
          <div class="evoke-sheet__header">
            <span id={titleId}>{this.heading}</span>
            <button type="button" class="evoke-sheet__close" aria-label="Close" onClick={() => this.close()}>
              {renderIcon('x', 'evoke-icon')}
            </button>
          </div>
          <div class="evoke-sheet__body"><slot /></div>
        </div>
      </div>
    );
  }
}
