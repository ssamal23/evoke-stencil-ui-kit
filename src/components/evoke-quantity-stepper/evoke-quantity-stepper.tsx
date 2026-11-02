import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';
import { renderIcon } from '../../utils/icons';

@Component({ tag: 'evoke-quantity-stepper', styleUrl: 'evoke-quantity-stepper.css', shadow: false })
export class EvokeQuantityStepper {
  @Prop({ mutable: true }) value = 1;
  @Prop() min = 1;
  @Prop() max = 99;
  /** Inline (minus, value, plus) or compact with a quantity dropdown */
  @Prop() appearance: 'inline' | 'compact' = 'inline';
  @Prop() disabled = false;
  /** Accessible name for the control */
  @Prop() label = 'Quantity';

  /** Emits the new quantity */
  @Event() evokeChange!: EventEmitter<number>;

  private inputEl?: HTMLInputElement;

  private clamp(n: number) {
    return Math.min(Math.max(Math.round(n), this.min), this.max);
  }

  private set(n: number) {
    const next = this.clamp(Number.isFinite(n) ? n : this.value);
    if (this.inputEl) this.inputEl.value = String(next);
    if (next === this.value) return;
    this.value = next;
    this.evokeChange.emit(next);
  }

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.set(this.value + 1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.set(this.value - 1);
    }
  };

  render() {
    if (this.appearance === 'compact') {
      const top = Math.min(this.max, this.min + 9);
      const opts: number[] = [];
      for (let i = this.min; i <= top; i++) opts.push(i);
      if (!opts.includes(this.value)) opts.push(this.value);
      return (
        <div class="evoke-qty evoke-qty--compact">
          <select class="evoke-qty__select" aria-label={this.label} disabled={this.disabled} onChange={(e) => this.set(Number((e.target as HTMLSelectElement).value))}>
            {opts.map((n) => <option value={String(n)} selected={n === this.value}>Qty: {n}</option>)}
          </select>
          {renderIcon('chevron-down', 'evoke-qty__chevron')}
        </div>
      );
    }

    return (
      <div class="evoke-qty evoke-qty--inline" role="group" aria-label={this.label}>
        <button type="button" class="evoke-qty__btn" aria-label="Decrease quantity" disabled={this.disabled || this.value <= this.min} onClick={() => this.set(this.value - 1)}>
          {renderIcon('minus', 'evoke-icon')}
        </button>
        <input
          class="evoke-qty__input"
          type="text"
          inputmode="numeric"
          pattern="[0-9]*"
          aria-label={this.label}
          value={String(this.value)}
          disabled={this.disabled}
          ref={(el) => (this.inputEl = el)}
          onKeyDown={this.onKeyDown}
          onChange={(e) => this.set(parseInt((e.target as HTMLInputElement).value, 10))}
        />
        <button type="button" class="evoke-qty__btn" aria-label="Increase quantity" disabled={this.disabled || this.value >= this.max} onClick={() => this.set(this.value + 1)}>
          {renderIcon('plus', 'evoke-icon')}
        </button>
      </div>
    );
  }
}
