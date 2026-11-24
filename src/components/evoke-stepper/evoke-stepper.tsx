import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';
import { renderIcon } from '../../utils/icons';

export interface EvokeStep {
  label: string;
  /** Small text under the label, e.g. "Optional" */
  description?: string;
}

function parseSteps(steps: EvokeStep[] | string): EvokeStep[] {
  if (Array.isArray(steps)) return steps;
  try {
    const parsed = JSON.parse(steps);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

@Component({ tag: 'evoke-stepper', styleUrl: 'evoke-stepper.css', shadow: false })
export class EvokeStepper {
  /** Steps as an array of { label, description? } or a JSON string of the same */
  @Prop() steps: EvokeStep[] | string = [];
  /** Zero-based index of the current step */
  @Prop({ mutable: true }) current = 0;
  /** Steps must be done in order: the header cannot jump ahead, only Back and Next move. */
  @Prop() linear = true;
  /** Show Back and Next buttons under the content (Next reads "Finish" on the last step) */
  @Prop() showActions = true;
  /** Accessible name for the stepper */
  @Prop() label = '';

  /** Emits the new current step index */
  @Event() evokeChange!: EventEmitter<number>;
  /** Fired when Finish is pressed on the last step */
  @Event() evokeComplete!: EventEmitter<void>;

  private go(i: number) {
    const n = parseSteps(this.steps).length;
    if (i < 0 || i >= n || i === this.current) return;
    this.current = i;
    this.evokeChange.emit(i);
  }

  private next = () => {
    if (this.current >= parseSteps(this.steps).length - 1) this.evokeComplete.emit();
    else this.go(this.current + 1);
  };

  render() {
    const steps = parseSteps(this.steps);
    const cur = Math.min(Math.max(Number(this.current) || 0, 0), Math.max(steps.length - 1, 0));
    return (
      <div class="evoke-stepper">
        <ol class="evoke-stepper__header" aria-label={this.label || undefined}>
          {steps.map((s, i) => {
            const state = i < cur ? 'done' : i === cur ? 'current' : 'todo';
            const reachable = !this.linear || i <= cur;
            return (
              <li class={`evoke-stepper__step evoke-stepper__step--${state}`}>
                <button
                  type="button"
                  class="evoke-stepper__btn"
                  disabled={!reachable}
                  aria-current={i === cur ? 'step' : undefined}
                  onClick={() => this.go(i)}
                >
                  <span class="evoke-stepper__marker">{state === 'done' ? renderIcon('check', 'evoke-icon') : i + 1}</span>
                  <span class="evoke-stepper__text">
                    <span class="evoke-stepper__label">{s.label}</span>
                    {s.description && <span class="evoke-stepper__desc">{s.description}</span>}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
        <div class="evoke-stepper__content" role="group" aria-label={steps[cur]?.label}>
          <slot />
        </div>
        {this.showActions && steps.length > 0 && (
          <div class="evoke-stepper__actions">
            <button type="button" class="evoke-stepper__action" disabled={cur === 0} onClick={() => this.go(cur - 1)}>Back</button>
            <button type="button" class="evoke-stepper__action evoke-stepper__action--primary" onClick={this.next}>{cur >= steps.length - 1 ? 'Finish' : 'Next'}</button>
          </div>
        )}
      </div>
    );
  }
}
