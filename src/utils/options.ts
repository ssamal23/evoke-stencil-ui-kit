export interface EvokeOption {
  label: string;
  value: string;
  disabled?: boolean;
}

/** Accepts an array, or a JSON string (so options can be set as an HTML attribute). */
export function parseOptions(options: EvokeOption[] | string): EvokeOption[] {
  if (Array.isArray(options)) return options;
  try {
    const parsed = JSON.parse(options);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
