import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import booksReducer from '../features/books/booksSlice';
import rentalsReducer from '../features/rentals/rentalsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    books: booksReducer,
    rentals: rentalsReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
