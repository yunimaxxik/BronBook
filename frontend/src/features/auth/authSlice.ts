import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../api/axios';
import type { User } from '../../interfaces/User';

const loadUserFromStorage = (): User | null => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: loadUserFromStorage(),
  isLoading: false,
  error: null
};

// Асинхронный thunk для входа
export const login = createAsyncThunk(
  'auth/login',
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post<User>('/api/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка входа');
    }
  }
);

// Асинхронный thunk для регистрации
export const register = createAsyncThunk(
  'auth/register',
  async (
    data: {
      email: string;
      password: string;
      name: string;
      contactPhone?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post<User>('/api/client/register', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Ошибка регистрации'
      );
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await api.post('/api/auth/logout');
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.error = null;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        localStorage.removeItem('user');
      });
  }
});

export default authSlice.reducer;
