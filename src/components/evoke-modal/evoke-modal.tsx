import { Component, Element, Prop, Event, EventEmitter, Listen, Watch, h } from '@stencil/core';
import { renderIcon } from '../../utils/icons';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

@Component({ tag: 'evoke-modal', styleUrl: 'evoke-modal.css', shadow: false })
export class EvokeModal {
  @Element() el!: HTMLElement;

  /** Whether the modal is visible */
  @Prop({ mutable: true, reflect: true }) open = false;
  @Prop() heading = '';
  /** Centred dialog, or a drawer sliding in from the right */
  @Prop() position: 'center' | 'right' = 'center';
  @Prop() size: 'sm' | 'md' | 'lg' = 'md';
  @Prop() closeOnBackdrop = true;
  /** Extra classes for the dialog panel */
  @Prop() modalClass = '';

  /** Fired when the modal requests to close (backdrop, Esc, or close button) */
  @Event() evokeClose!: EventEmitter<void>;

  private panel?: HTMLElement;
  private previouslyFocused: HTMLElement | null = null;
  private previousOverflow = '';
  private pendingFocus = false;
  private locked = false;
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
    if (this.locked) this.unlockScroll();
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
    this.unlockScroll();
    this.previouslyFocused?.focus?.();
    this.previouslyFocused = null;
  }

  private unlockScroll() {
    document.body.style.overflow = this.previousOverflow;
    this.locked = false;
  }

  private focusables(): HTMLElement[] {
    if (!this.panel) return [];
    return Array.from(this.panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((n) => n.offsetParent !== null);
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
    const titleId = `evoke-modal-${this.uid}-title`;
    return (
      <div class={`evoke-modal__backdrop evoke-modal__backdrop--${this.position}`} onClick={() => this.closeOnBackdrop && this.close()}>
        <div
          class={`evoke-modal evoke-modal--${this.position} evoke-modal--${this.size} ${this.modalClass}`.replace(/\s+/g, ' ').trim()}
          role="dialog"
          aria-modal="true"
          aria-labelledby={this.heading ? titleId : undefined}
          tabindex={-1}
          ref={(el) => (this.panel = el)}
          onClick={(e) => e.stopPropagation()}
        >
          <div class="evoke-modal__header">
            <span id={titleId}>{this.heading}</span>
            <button type="button" class="evoke-modal__close" aria-label="Close" onClick={() => this.close()}>
              {renderIcon('x', 'evoke-icon')}
            </button>
          </div>
          <div class="evoke-modal__body"><slot /></div>
        </div>
      </div>
    );
  }
}
