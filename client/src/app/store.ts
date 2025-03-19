import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "./features/authSlice";
import eventReducer from "./features/eventSlice";

// Tạo Redux store
export const store = configureStore({
  reducer: {
    // Các reducers sẽ được thêm vào đây
    auth: authReducer,
    events: eventReducer,
  },
  // Thêm middleware nếu cần
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Cấu hình listeners cho RTK Query
setupListeners(store.dispatch);

// Inference types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
