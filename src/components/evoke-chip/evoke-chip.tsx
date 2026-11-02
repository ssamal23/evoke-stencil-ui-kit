import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';
import { renderIcon } from '../../utils/icons';

@Component({ tag: 'evoke-chip', styleUrl: 'evoke-chip.css', shadow: false })
export class EvokeChip {
  @Prop() label = '';
  /** Selected state (filter chip) */
  @Prop({ mutable: true, reflect: true }) selected = false;
  /** Shows a remove button instead of toggling selection */
  @Prop() removable = false;
  @Prop() disabled = false;

  /** Emits the new selected state (filter chip) */
  @Event() evokeChange!: EventEmitter<boolean>;
  /** Fired when the remove button is clicked (removable chip) */
  @Event() evokeRemove!: EventEmitter<void>;

  render() {
    if (this.removable) {
      return (
        <span class={`evoke-chip evoke-chip--removable ${this.disabled ? 'evoke-chip--disabled' : ''}`.trim()}>
          <span class="evoke-chip__label">{this.label}<slot /></span>
          <button type="button" class="evoke-chip__remove" aria-label={`Remove ${this.label}`} disabled={this.disabled} onClick={() => this.evokeRemove.emit()}>
            {renderIcon('x', 'evoke-icon')}
          </button>
        </span>
      );
    }
    return (
      <button
        type="button"
        class={`evoke-chip evoke-chip--filter ${this.selected ? 'evoke-chip--selected' : ''}`.trim()}
        aria-pressed={this.selected ? 'true' : 'false'}
        disabled={this.disabled}
        onClick={() => {
          this.selected = !this.selected;
          this.evokeChange.emit(this.selected);
        }}
      >
        {this.selected && renderIcon('check', 'evoke-icon')}
        <span class="evoke-chip__label">{this.label}<slot /></span>
      </button>
    );
  }
}
