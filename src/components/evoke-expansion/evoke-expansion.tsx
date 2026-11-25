import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';
import { renderIcon } from '../../utils/icons';

@Component({ tag: 'evoke-expansion', styleUrl: 'evoke-expansion.css', shadow: false })
export class EvokeExpansion {
  /** Title shown in the header */
  @Prop() heading = '';
  /** Secondary text beside the title */
  @Prop() description = '';
  @Prop({ mutable: true, reflect: true }) expanded = false;
  @Prop() disabled = false;

  /** Emits the new expanded state */
  @Event() evokeToggle!: EventEmitter<boolean>;

  private uid = Math.random().toString(36).slice(2, 9);

  private toggle = () => {
    if (this.disabled) return;
    this.expanded = !this.expanded;
    this.evokeToggle.emit(this.expanded);
  };

  render() {
    const panelId = `evoke-expansion-${this.uid}-panel`;
    return (
      <div class={`evoke-expansion ${this.expanded ? 'evoke-expansion--open' : ''}`.trim()}>
        <button type="button" class="evoke-expansion__header" aria-expanded={this.expanded ? 'true' : 'false'} aria-controls={panelId} disabled={this.disabled} onClick={this.toggle}>
          <span class="evoke-expansion__title">{this.heading}</span>
          {this.description && <span class="evoke-expansion__desc">{this.description}</span>}
          {renderIcon('chevron-down', 'evoke-icon evoke-expansion__chevron')}
        </button>
        <div id={panelId} class="evoke-expansion__panel" role="region" hidden={!this.expanded}>
          <div class="evoke-expansion__body"><slot /></div>
        </div>
      </div>
    );
  }
}
