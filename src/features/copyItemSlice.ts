import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CopyState {
  isCopy: { [key: string]: boolean };
}

const initialState: CopyState = {
  isCopy: {},
};

export const copyItemSlice = createSlice({
  name: "copy",
  initialState,
  reducers: {
    setCopyStatus: (
      state,
      action: PayloadAction<{ id: string; status: boolean }>
    ) => {
      const { id, status } = action.payload;
      state.isCopy[id] = !status;
    },
    resetCopyStatus: (state, action: PayloadAction<{ id: string }>) => {
      const next = { ...state.isCopy };
      delete next[action.payload.id];
      state.isCopy = next;
    },
  },
});

export const { setCopyStatus, resetCopyStatus } = copyItemSlice.actions;

export default copyItemSlice.reducer;