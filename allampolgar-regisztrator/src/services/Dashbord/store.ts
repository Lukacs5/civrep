// src/services/Dashbord/store.ts
import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from './usersSlice';

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
  },
});

// RootState és AppDispatch típusok exportálása
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
