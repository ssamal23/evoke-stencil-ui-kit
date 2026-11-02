import { Component, Prop, Event, EventEmitter, Watch, h } from '@stencil/core';
import { EvokeIcon, renderIcon } from '../../utils/icons';

const TYPE_ICON: Record<string, EvokeIcon> = { info: 'info', success: 'check', warning: 'alert', danger: 'alert' };

@Component({ tag: 'evoke-toast', styleUrl: 'evoke-toast.css', shadow: false })
export class EvokeToast {
  @Prop({ mutable: true, reflect: true }) open = false;
  /** Message text (or use the default slot) */
  @Prop() message = '';
  @Prop() type: 'info' | 'success' | 'warning' | 'danger' = 'info';
  /** Label of an action button, e.g. "View cart". Leave empty for a simple message. */
  @Prop() action = '';
  /** Auto-dismiss after this many ms; 0 keeps it open until closed */
  @Prop() duration = 4000;
  @Prop() position: 'bottom' | 'top' = 'bottom';

  /** Fired when the action button is clicked */
  @Event() evokeAction!: EventEmitter<void>;
  /** Fired when the toast closes (button, action or timeout) */
  @Event() evokeClose!: EventEmitter<void>;

  private timer?: ReturnType<typeof setTimeout>;

  @Watch('open')
  onOpen(next: boolean) {
    this.clearTimer();
    if (next) this.startTimer();
  }

  componentDidLoad() {
    if (this.open) this.startTimer();
  }

  disconnectedCallback() {
    this.clearTimer();
  }

  private startTimer() {
    if (this.duration > 0) this.timer = setTimeout(() => this.close(), this.duration);
  }

  private clearTimer() {
    if (this.timer) clearTimeout(this.timer);
    this.timer = undefined;
  }

  private close() {
    this.clearTimer();
    this.open = false;
    this.evokeClose.emit();
  }

  render() {
    if (!this.open) return null;
    const urgent = this.type === 'danger' || this.type === 'warning';
    return (
      <div
        class={`evoke-toast evoke-toast--${this.position} evoke-toast--${this.type}`}
        role={urgent ? 'alert' : 'status'}
        aria-live={urgent ? 'assertive' : 'polite'}
        onMouseEnter={() => this.clearTimer()}
        onMouseLeave={() => this.open && this.startTimer()}
      >
        {renderIcon(TYPE_ICON[this.type], 'evoke-toast__icon')}
        <span class="evoke-toast__message">{this.message}<slot /></span>
        {this.action && (
          <button
            type="button"
            class="evoke-toast__action"
            onClick={() => {
              this.evokeAction.emit();
              this.close();
            }}
          >
            {this.action}
          </button>
        )}
        <button type="button" class="evoke-toast__close" aria-label="Dismiss" onClick={() => this.close()}>
          {renderIcon('x', 'evoke-icon')}
        </button>
      </div>
    );
  }
}
