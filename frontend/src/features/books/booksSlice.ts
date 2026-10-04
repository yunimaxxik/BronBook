import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../api/axios';
import { Library } from '../../interfaces/Library';
import { Book } from '../../interfaces/Book';

interface BooksState {
  books: Book[];
  libraries: Library[];
  isLoading: boolean;
  error: string | null;
  filters: {
    title: string;
    author: string;
    libraryId: number | null;
    availableOnly: boolean;
  };
}

const initialState: BooksState = {
  books: [],
  libraries: [],
  isLoading: false,
  error: null,
  filters: {
    title: '',
    author: '',
    libraryId: null,
    availableOnly: false
  }
};

export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { books: BooksState };
      const { title, author, libraryId, availableOnly } = state.books.filters;

      const params = new URLSearchParams();
      if (title) params.append('title', title);
      if (author) params.append('author', author);
      if (libraryId) params.append('library', libraryId.toString());
      if (availableOnly) params.append('availableOnly', 'true');

      const response = await api.get<Book[]>(
        `/api/common/books?${params.toString()}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Ошибка загрузки книг'
      );
    }
  }
);

export const fetchLibraries = createAsyncThunk(
  'books/fetchLibraries',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<Library[]>('/api/common/libraries');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Ошибка загрузки библиотек'
      );
    }
  }
);

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    setFilter: (
      state,
      action: PayloadAction<Partial<BooksState['filters']>>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.books = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchLibraries.fulfilled, (state, action) => {
        state.libraries = action.payload;
      });
  }
});

export const { setFilter, clearFilters } = booksSlice.actions;
export default booksSlice.reducer;
