import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ClipboardItem {
  id: string;
  text: string;
  pinned: boolean;
}

interface ClipboardState {
  items: ClipboardItem[];
}

const initialState: ClipboardState = {
  items: [],
};

const sortHistory = (items: ClipboardItem[]) => {
  return [...items].sort((a, b) =>
    a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1
  );
};

export const copyBoardSlice = createSlice({
  name: "clipboard",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<ClipboardItem>) => {
      const isTextDuplicate = state.items.some(
        (item) => item.text === action.payload.text
      );

      if (!isTextDuplicate) {
        state.items.unshift(action.payload);
      }
    },
    deleteItem: (state, action) => {
      const newHistory = state.items;
      const itemId = newHistory.findIndex((item) => item.id === action.payload);
      newHistory.splice(itemId, 1);
      // state.items = state.items.filter((item) => item.id !== action.payload);
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
  },
  selectors: {
    selectClipboardItems: (state) => state.items,
  },
});

export const { addItem, deleteItem, togglePin } = copyBoardSlice.actions;

export default copyBoardSlice.reducer;
