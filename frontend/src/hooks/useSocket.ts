import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { addMessage } from '../features/support/supportSlice';
import type { Message } from '../interfaces/Message';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!user) return;

    const socket = io(import.meta.env.VITE_WS_URL || 'ws://localhost:3000', {
      query: { userId: user.id.toString() },
      withCredentials: true
    });

    socketRef.current = socket;

    // Слушаем новые сообщения
    socket.on('newMessage', (message: Message) => {
      dispatch(addMessage(message));
    });

    return () => {
      socket.disconnect();
    };
  }, [user, dispatch]);

  const subscribeToChat = (chatId: number) => {
    if (socketRef.current) {
      socketRef.current.emit('subscribeToChat', chatId);
    }
  };

  return { subscribeToChat };
};
