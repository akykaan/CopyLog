export interface ClipboardItemPayload {
  id: string;
  text: string;
  pinned: boolean;
}

export interface SharedStatePayload {
  board: {
    items: ClipboardItemPayload[];
  };
}

export const MAX_ITEMS = 200;
export const MAX_TEXT_LENGTH = 64 * 1024;
export const MAX_CLIPBOARD_READ_LENGTH = 1024 * 1024;

function isClipboardItemPayload(value: unknown): value is ClipboardItemPayload {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    item.id.length > 0 &&
    item.id.length <= 128 &&
    typeof item.text === "string" &&
    item.text.length <= MAX_TEXT_LENGTH &&
    typeof item.pinned === "boolean"
  );
}

export function isSharedStatePayload(
  value: unknown
): value is SharedStatePayload {
  if (typeof value !== "object" || value === null) return false;
  const state = value as Record<string, unknown>;
  if (typeof state.board !== "object" || state.board === null) return false;
  const board = state.board as Record<string, unknown>;
  if (!Array.isArray(board.items)) return false;
  return board.items.every(isClipboardItemPayload);
}