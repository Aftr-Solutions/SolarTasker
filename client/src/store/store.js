import { configureStore } from "@reduxjs/toolkit";
import regionReducer from "./ActionReducers/regionReducer";

export const store = configureStore({
  reducer: {
    region: regionReducer,
  },
});
