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
      action: PayloadAction<{ id: number; status: boolean }>
    ) => {
      const { id, status } = action.payload;
      state.isCopy[id] = !status;
    },
    resetCopyStatus: (state, action: PayloadAction<{ id: number }>) => {
      const { [action.payload.id]: _, ...rest } = state.isCopy;
      state.isCopy = { ...rest };
    },
  },
});

export const { setCopyStatus, resetCopyStatus } = copyItemSlice.actions;

export default copyItemSlice.reducer;
