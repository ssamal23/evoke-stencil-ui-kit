import { Component, Prop, h } from '@stencil/core';

const RADIUS = 18;
const CIRC = 2 * Math.PI * RADIUS;

@Component({ tag: 'evoke-progress', styleUrl: 'evoke-progress.css', shadow: false })
export class EvokeProgress {
  /** Linear bar, or circular spinner / ring */
  @Prop() type: 'linear' | 'circular' = 'linear';
  /** Progress from 0 to 100 */
  @Prop() value = 0;
  /** Unknown duration: animates continuously and ignores `value` */
  @Prop() indeterminate = false;
  /** Accessible name, e.g. "Uploading" */
  @Prop() label = 'Loading';
  /** Diameter in px for the circular type */
  @Prop() size = 40;

  render() {
    const v = Math.min(Math.max(Number(this.value) || 0, 0), 100);
    const aria = {
      role: 'progressbar',
      'aria-label': this.label,
      'aria-valuemin': '0',
      'aria-valuemax': '100',
      'aria-valuenow': this.indeterminate ? undefined : String(Math.round(v)),
    };

    if (this.type === 'circular') {
      return (
        <div class={`evoke-progress evoke-progress--circular ${this.indeterminate ? 'evoke-progress--indeterminate' : ''}`.trim()} style={{ width: `${this.size}px`, height: `${this.size}px` }} {...aria}>
          <svg viewBox="0 0 44 44" aria-hidden="true" focusable="false">
            <circle class="evoke-progress__track" cx="22" cy="22" r={String(RADIUS)} fill="none" stroke-width="4" />
            <circle
              class="evoke-progress__ring"
              cx="22"
              cy="22"
              r={String(RADIUS)}
              fill="none"
              stroke-width="4"
              stroke-linecap="round"
              stroke-dasharray={this.indeterminate ? `${CIRC * 0.25} ${CIRC}` : String(CIRC)}
              stroke-dashoffset={this.indeterminate ? undefined : String(CIRC * (1 - v / 100))}
            />
          </svg>
        </div>
      );
    }

    return (
      <div class={`evoke-progress evoke-progress--linear ${this.indeterminate ? 'evoke-progress--indeterminate' : ''}`.trim()} {...aria}>
        <div class="evoke-progress__bar" style={this.indeterminate ? undefined : { width: `${v}%` }} />
      </div>
    );
  }
}
