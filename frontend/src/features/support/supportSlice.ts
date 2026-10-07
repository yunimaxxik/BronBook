import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../api/axios';
import type { Message } from '../../interfaces/Message';

export interface SupportRequest {
  id: number;
  userId: number;
  isActive: boolean;
  createdAt: string;
  messages: Message[];
  user?: {
    id: number;
    name: string;
    email: string;
  };
  unreadCount?: number;
}

interface SupportState {
  requests: SupportRequest[];
  currentRequest: SupportRequest | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

const initialState: SupportState = {
  requests: [],
  currentRequest: null,
  messages: [],
  isLoading: false,
  error: null
};

// === CLIENT ===

export const createSupportRequest = createAsyncThunk(
  'support/createRequest',
  async (text: string, { rejectWithValue }) => {
    try {
      const response = await api.post<SupportRequest>(
        '/api/client/support-requests',
        { text }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Ошибка создания обращения'
      );
    }
  }
);

export const fetchClientRequests = createAsyncThunk(
  'support/fetchClientRequests',
  async ({ isActive }: { isActive?: boolean } = {}, { rejectWithValue }) => {
    try {
      const params =
        isActive !== undefined ? { isActive: isActive.toString() } : {};
      const response = await api.get<SupportRequest[]>(
        '/api/client/support-requests',
        { params }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Ошибка загрузки обращений'
      );
    }
  }
);

// === MANAGER ===

export const fetchManagerRequests = createAsyncThunk(
  'support/fetchManagerRequests',
  async ({ isActive }: { isActive?: boolean } = {}, { rejectWithValue }) => {
    try {
      const params =
        isActive !== undefined ? { isActive: isActive.toString() } : {};
      const response = await api.get<SupportRequest[]>(
        '/api/manager/support-requests',
        { params }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Ошибка загрузки обращений'
      );
    }
  }
);

export const closeRequest = createAsyncThunk(
  'support/closeRequest',
  async (requestId: number, { rejectWithValue }) => {
    try {
      await api.post(`/api/manager/support-requests/${requestId}/close`);
      return requestId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Ошибка закрытия обращения'
      );
    }
  }
);

// === COMMON ===

export const fetchMessages = createAsyncThunk(
  'support/fetchMessages',
  async (requestId: number, { rejectWithValue }) => {
    try {
      const response = await api.get<Message[]>(
        `/api/common/support-requests/${requestId}/messages`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Ошибка загрузки сообщений'
      );
    }
  }
);

export const sendMessage = createAsyncThunk(
  'support/sendMessage',
  async (
    { requestId, text }: { requestId: number; text: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post<Message>(
        `/api/common/support-requests/${requestId}/messages`,
        { text }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Ошибка отправки сообщения'
      );
    }
  }
);

export const markMessagesAsRead = createAsyncThunk(
  'support/markMessagesAsRead',
  async (requestId: number, { rejectWithValue }) => {
    try {
      await api.post(
        `/api/common/support-requests/${requestId}/messages/read`,
        {
          createdBefore: new Date().toISOString()
        }
      );
      return requestId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Ошибка отметки прочтения'
      );
    }
  }
);

const supportSlice = createSlice({
  name: 'support',
  initialState,
  reducers: {
    setCurrentRequest: (
      state,
      action: PayloadAction<SupportRequest | null>
    ) => {
      state.currentRequest = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // createRequest
      .addCase(createSupportRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createSupportRequest.fulfilled, (state, action) => {
        state.requests.unshift(action.payload);
        state.isLoading = false;
      })
      .addCase(createSupportRequest.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
      })
      // fetchClientRequests
      .addCase(fetchClientRequests.fulfilled, (state, action) => {
        state.requests = action.payload;
      })
      // fetchManagerRequests
      .addCase(fetchManagerRequests.fulfilled, (state, action) => {
        state.requests = action.payload;
      })
      // closeRequest
      .addCase(closeRequest.fulfilled, (state, action) => {
        const request = state.requests.find((r) => r.id === action.payload);
        if (request) request.isActive = false;
      })
      // fetchMessages
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages = action.payload;
      })
      // sendMessage
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
      });
  }
});

export const { setCurrentRequest, addMessage, clearError } =
  supportSlice.actions;
export default supportSlice.reducer;
