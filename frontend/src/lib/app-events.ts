export const DATA_CHANGED_EVENT = 'vivafemini:data-changed';

export function emitDataChanged(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(DATA_CHANGED_EVENT));
  }
}
