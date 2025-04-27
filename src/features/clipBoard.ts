import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
