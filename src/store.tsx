import { configureStore } from "@reduxjs/toolkit";
import clipBoardReducer from "./features/clipBoard";
import copyReducer from "./features/copyItemSlice";

export const store = configureStore({
  reducer: {
    board: clipBoardReducer,
    copy: copyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
