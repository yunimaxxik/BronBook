// frontend/src/pages/SupportPage.tsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import {
  fetchClientRequests,
  createSupportRequest,
  fetchMessages,
  sendMessage,
  markMessagesAsRead,
  setCurrentRequest
} from '../../features/support/supportSlice';
import { useSocket } from '../../hooks/useSocket';
import './SupportPage.css';

export default function SupportPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { requests, currentRequest, messages } = useSelector(
    (state: RootState) => state.support
  );
  const user = useSelector((state: RootState) => state.auth.user);
  const { subscribeToChat } = useSocket();

  const [newRequestText, setNewRequestText] = useState('');
  const [messageText, setMessageText] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    dispatch(fetchClientRequests({}));
  }, [dispatch]);

  const handleSelectRequest = (request: any) => {
    dispatch(setCurrentRequest(request));
    dispatch(fetchMessages(request.id));
    dispatch(markMessagesAsRead(request.id));
    subscribeToChat(request.id);
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(createSupportRequest(newRequestText));
    setNewRequestText('');
    setShowCreateForm(false);
    dispatch(fetchClientRequests({}));
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRequest || !messageText.trim()) return;
    await dispatch(
      sendMessage({ requestId: currentRequest.id, text: messageText })
    );
    setMessageText('');
  };

  return (
    <div className="support-page">
      <h1>Техподдержка</h1>

      <div className="support-page__layout">
        {/* Список обращений */}
        <div className="support-page__sidebar">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="support-page__create-btn"
          >
            {showCreateForm ? 'Отмена' : 'Новое обращение'}
          </button>

          {showCreateForm && (
            <form
              onSubmit={handleCreateRequest}
              className="support-page__create-form"
            >
              <textarea
                value={newRequestText}
                onChange={(e) => setNewRequestText(e.target.value)}
                placeholder="Опишите проблему..."
                required
                className="support-page__textarea"
              />
              <button
                type="submit"
                className="support-page__submit-btn"
              >
                Создать
              </button>
            </form>
          )}

          <div className="support-page__requests-list">
            {requests.map((request) => (
              <div
                key={request.id}
                onClick={() => handleSelectRequest(request)}
                className={`support-page__request-item ${
                  currentRequest?.id === request.id
                    ? 'support-page__request-item--active'
                    : ''
                }`}
              >
                <div className="support-page__request-header">
                  <span className="support-page__request-date">
                    {new Date(request.createdAt).toLocaleDateString('ru-RU')}
                  </span>
                  <span
                    className={`support-page__status ${
                      request.isActive
                        ? 'support-page__status--active'
                        : 'support-page__status--closed'
                    }`}
                  >
                    {request.isActive ? 'Активно' : 'Закрыто'}
                  </span>
                </div>
                <p className="support-page__request-preview">
                  {request.messages?.[0]?.text || 'Нет сообщений'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Чат */}
        <div className="support-page__chat">
          {currentRequest ? (
            <>
              <div className="support-page__chat-header">
                <h3>Обращение #{currentRequest.id}</h3>
                <span
                  className={`support-page__status ${
                    currentRequest.isActive
                      ? 'support-page__status--active'
                      : 'support-page__status--closed'
                  }`}
                >
                  {currentRequest.isActive ? 'Активно' : 'Закрыто'}
                </span>
              </div>

              <div className="support-page__messages">
                {messages.map((msg) => {
                  const isMyMessage = msg.authorId === user?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`support-page__message ${
                        isMyMessage
                          ? 'support-page__message--own'
                          : 'support-page__message--other'
                      }`}
                    >
                      <div className="support-page__message-author">
                        {msg.author?.name || 'Поддержка'}
                      </div>
                      <div className="support-page__message-text">
                        {msg.text}
                      </div>
                      <div className="support-page__message-time">
                        {new Date(msg.sentAt).toLocaleTimeString('ru-RU', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {currentRequest.isActive && (
                <form
                  onSubmit={handleSendMessage}
                  className="support-page__input-form"
                >
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Введите сообщение..."
                    className="support-page__input"
                  />
                  <button
                    type="submit"
                    className="support-page__send-btn"
                  >
                    Отправить
                  </button>
                </form>
              )}
            </>
          ) : (
            <div className="support-page__empty">
              Выберите обращение слева или создайте новое
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
