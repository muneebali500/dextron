import { configureStore } from "@reduxjs/toolkit";
import driveReducerSlice from "./reducers/driveReducerSlice";

export const store = configureStore({
  reducer: {
    drive: driveReducerSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
