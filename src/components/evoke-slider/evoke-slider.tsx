import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';

@Component({ tag: 'evoke-slider', styleUrl: 'evoke-slider.css', shadow: false })
export class EvokeSlider {
  @Prop() label = '';
  @Prop({ mutable: true }) value = 0;
  @Prop() min = 0;
  @Prop() max = 100;
  @Prop() step = 1;
  /** Show the current value beside the label */
  @Prop() showValue = true;
  @Prop() disabled = false;

  /** Emits the new value while the slider is moved */
  @Event() evokeChange!: EventEmitter<number>;

  private uid = Math.random().toString(36).slice(2, 9);

  render() {
    const id = `evoke-slider-${this.uid}`;
    const span = this.max - this.min;
    const pct = span > 0 ? Math.min(100, Math.max(0, ((Number(this.value) - this.min) / span) * 100)) : 0;
    return (
      <div class="evoke-slider">
        {(this.label || this.showValue) && (
          <div class="evoke-slider__head">
            {this.label && <label class="evoke-slider__label" htmlFor={id}>{this.label}</label>}
            {this.showValue && <span class="evoke-slider__value" aria-hidden="true">{this.value}</span>}
          </div>
        )}
        <input
          id={id}
          type="range"
          class="evoke-slider__input"
          style={{ '--evoke-slider-fill': `${pct}%` }}
          min={this.min}
          max={this.max}
          step={this.step}
          value={this.value}
          disabled={this.disabled}
          aria-label={this.label ? undefined : 'Slider'}
          onInput={(e) => {
            this.value = Number((e.target as HTMLInputElement).value);
            this.evokeChange.emit(this.value);
          }}
        />
      </div>
    );
  }
}
