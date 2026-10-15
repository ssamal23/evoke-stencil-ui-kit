import { Component, Prop, Event, EventEmitter, Listen, h } from '@stencil/core';

@Component({ tag: 'evoke-modal', styleUrl: 'evoke-modal.css', shadow: false })
export class EvokeModal {
  /** Whether the modal is visible */
  @Prop({ mutable: true, reflect: true }) open = false;
  @Prop() heading = '';
  @Prop() closeOnBackdrop = true;
  /** Extra classes for the dialog panel */
  @Prop() modalClass = '';

  /** Fired when the modal requests to close (backdrop, Esc, or close button) */
  @Event() evokeClose!: EventEmitter<void>;

  @Listen('keydown', { target: 'window' })
  onKeydown(e: KeyboardEvent) {
    if (this.open && e.key === 'Escape') this.close();
  }

  private close() {
    this.open = false;
    this.evokeClose.emit();
  }

  render() {
    if (!this.open) return null;
    return (
      <div class="evoke-modal__backdrop" onClick={() => this.closeOnBackdrop && this.close()}>
        <div
          class={`evoke-modal ${this.modalClass}`.trim()}
          role="dialog"
          aria-modal="true"
          aria-label={this.heading || undefined}
          onClick={(e) => e.stopPropagation()}
        >
          <div class="evoke-modal__header">
            <span>{this.heading}</span>
            <button type="button" class="evoke-modal__close" aria-label="Close" onClick={() => this.close()}>×</button>
          </div>
          <div class="evoke-modal__body"><slot /></div>
        </div>
      </div>
    );
  }
}
