import { configureStore } from '@reduxjs/toolkit';
import quranSlice from './slices/quranSlice';

export const store = configureStore({
  reducer: {
    quran: quranSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
}); 