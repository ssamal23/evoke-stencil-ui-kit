import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';

@Component({ tag: 'evoke-alert', styleUrl: 'evoke-alert.css', shadow: false })
export class EvokeAlert {
  @Prop() type: 'info' | 'success' | 'warning' | 'danger' = 'info';
  @Prop() dismissible = false;
  /** Fired when the dismiss button is clicked */
  @Event() evokeDismiss!: EventEmitter<void>;

  render() {
    return (
      <div class={`evoke-alert evoke-alert--${this.type}`} role="alert">
        <div class="evoke-alert__content"><slot /></div>
        {this.dismissible && (
          <button type="button" class="evoke-alert__close" aria-label="Dismiss" onClick={() => this.evokeDismiss.emit()}>×</button>
        )}
      </div>
    );
  }
}
