import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MAX_ITEMS, MAX_TEXT_LENGTH } from "../types/ipc";

export interface ClipboardItem {
  id: string;
  text: string;
  pinned: boolean;
}

export interface ClipboardState {
  items: ClipboardItem[];
  searchText: string;
}

export const initialState: ClipboardState = {
  items: [],
  searchText: "",
};

const sortHistory = (items: ClipboardItem[]) => {
  return [...items].sort((a, b) =>
    a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1
  );
};

export const copyBoardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<ClipboardItem>) => {
      const text =
        action.payload.text.length > MAX_TEXT_LENGTH
          ? action.payload.text.slice(0, MAX_TEXT_LENGTH)
          : action.payload.text;

      const isTextDuplicate = state.items.some((item) => item.text === text);

      if (!isTextDuplicate) {
        state.items.unshift({ ...action.payload, text });
        if (state.items.length > MAX_ITEMS) {
          const overflow = state.items.length - MAX_ITEMS;
          const removableIds = new Set(
            state.items
              .filter((item) => !item.pinned)
              .slice(-overflow)
              .map((item) => item.id)
          );
          state.items = state.items.filter((item) => !removableIds.has(item.id));
        }
      }
    },
    deleteItem: (state, action) => {
      const itemId = state.items.findIndex((item) => item.id === action.payload);
      if (itemId === -1) return;
      state.items.splice(itemId, 1);
    },
    togglePin: (state, action) => {
      const itemId = state.items.findIndex(
        (item) => item.id === action.payload
      );
      const item = state.items[itemId];
      state.items[itemId] = item.pinned
        ? { ...item, pinned: false }
        : { ...item, pinned: true };
      state.items = sortHistory(state.items);
    },
    setSearchText: (state, action: PayloadAction<string>) => {
      state.searchText = action.payload;
    },
  },
  selectors: {
    selectClipboardItems: (state: ClipboardState) => state.items,
    selectFilteredItems: (state) => {
      if (state.searchText.trim() === "") {
        return state.items;
      }
      return state.items.filter((item) =>
        item.text.toLowerCase().includes(state.searchText.toLowerCase())
      );
    },
    selectSearchText: (state) => state.searchText,
  },
});

export const { addItem, deleteItem, togglePin, setSearchText } =
  copyBoardSlice.actions;

export default copyBoardSlice.reducer;
