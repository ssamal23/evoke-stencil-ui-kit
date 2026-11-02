import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';
import { EvokeIcon, renderIcon } from '../../utils/icons';

const TYPE_ICON: Record<string, EvokeIcon> = { info: 'info', success: 'check', warning: 'alert', danger: 'alert' };

@Component({ tag: 'evoke-alert', styleUrl: 'evoke-alert.css', shadow: false })
export class EvokeAlert {
  @Prop() type: 'info' | 'success' | 'warning' | 'danger' = 'info';
  /** Subtle (tinted background) or solid (filled colour) */
  @Prop() appearance: 'subtle' | 'solid' = 'subtle';
  @Prop() dismissible = false;
  /** Fired when the dismiss button is clicked */
  @Event() evokeDismiss!: EventEmitter<void>;

  render() {
    return (
      <div class={`evoke-alert evoke-alert--${this.type} evoke-alert--${this.appearance}`} role={this.type === 'danger' || this.type === 'warning' ? 'alert' : 'status'}>
        {renderIcon(TYPE_ICON[this.type], 'evoke-alert__icon')}
        <div class="evoke-alert__content"><slot /></div>
        {this.dismissible && (
          <button type="button" class="evoke-alert__close" aria-label="Dismiss" onClick={() => this.evokeDismiss.emit()}>
            {renderIcon('x', 'evoke-icon')}
          </button>
        )}
      </div>
    );
  }
}
