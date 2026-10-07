import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/axios';

import { Rental } from '../../interfaces/Rental';

interface RentalsState {
  rentals: Rental[];
  isLoading: boolean;
  error: string | null;
}

const initialState: RentalsState = {
  rentals: [],
  isLoading: false,
  error: null
};

export const fetchRentals = createAsyncThunk(
  'rentals/fetchRentals',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<Rental[]>('/api/client/rentals');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Ошибка загрузки аренд'
      );
    }
  }
);

export const createRental = createAsyncThunk(
  'rentals/createRental',
  async (
    data: {
      bookId: number;
      libraryId: number;
      dateStart: string;
      dateEnd: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post<Rental>('/api/client/rentals', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Ошибка бронирования'
      );
    }
  }
);

const rentalsSlice = createSlice({
  name: 'rentals',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRentals.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRentals.fulfilled, (state, action) => {
        state.rentals = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchRentals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createRental.pending, (state) => {
        state.error = null;
      })
      .addCase(createRental.fulfilled, (state, action) => {
        state.rentals.unshift(action.payload);
      })
      .addCase(createRental.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  }
});

export const { clearError } = rentalsSlice.actions;
export default rentalsSlice.reducer;
