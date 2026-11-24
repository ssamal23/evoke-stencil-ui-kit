import type { EvokeIcon } from './icons';

export interface EvokeListItem {
  label: string;
  value: string;
  /** Secondary line under the label */
  description?: string;
  /** Optional leading icon */
  icon?: EvokeIcon;
  disabled?: boolean;
}

export interface EvokeMenuOption {
  label?: string;
  value?: string;
  disabled?: boolean;
  icon?: EvokeIcon;
  /** Renders a separator line instead of an item */
  divider?: boolean;
}

function parseArray<T>(input: T[] | string): T[] {
  if (Array.isArray(input)) return input;
  try {
    const parsed = JSON.parse(input);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Accepts an array, or a JSON string (so items can be set as an HTML attribute). */
export const parseListItems = (items: EvokeListItem[] | string) => parseArray<EvokeListItem>(items);
export const parseMenuOptions = (options: EvokeMenuOption[] | string) => parseArray<EvokeMenuOption>(options);

/** Selected values from a string, a JSON array string, a comma list, or an array. */
export function toValues(value: string | string[], multiple: boolean): string[] {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  if (multiple) {
    if (value.trim().startsWith('[')) {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed.map(String);
      } catch { /* fall through to a comma list */ }
    }
    return value.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return [value];
}
