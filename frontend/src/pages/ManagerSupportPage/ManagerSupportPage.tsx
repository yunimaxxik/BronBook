import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import {
  fetchManagerRequests,
  fetchMessages,
  sendMessage,
  markMessagesAsRead,
  closeRequest,
  setCurrentRequest
} from '../../features/support/supportSlice';
import { useSocket } from '../../hooks/useSocket';
import './ManagerSupportPage.css';

export default function ManagerSupportPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { requests, currentRequest, messages } = useSelector(
    (state: RootState) => state.support
  );
  const user = useSelector((state: RootState) => state.auth.user);
  const { subscribeToChat } = useSocket();

  const [messageText, setMessageText] = useState('');
  const [filterActive, setFilterActive] = useState<boolean | undefined>(
    undefined
  );

  useEffect(() => {
    dispatch(fetchManagerRequests({ isActive: filterActive }));
  }, [dispatch, filterActive]);

  const handleSelectRequest = (request: any) => {
    dispatch(setCurrentRequest(request));
    dispatch(fetchMessages(request.id));
    dispatch(markMessagesAsRead(request.id));
    subscribeToChat(request.id);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRequest || !messageText.trim()) return;
    await dispatch(
      sendMessage({ requestId: currentRequest.id, text: messageText })
    );
    setMessageText('');
  };

  const handleCloseRequest = async () => {
    if (!currentRequest) return;
    await dispatch(closeRequest(currentRequest.id));
    dispatch(setCurrentRequest(null));
    dispatch(fetchManagerRequests({ isActive: filterActive }));
  };

  return (
    <div className="support-page">
      <h1>Панель менеджера - Техподдержка</h1>

      <div
        className="support-page__filters"
        style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}
      >
        <button
          onClick={() => setFilterActive(undefined)}
          className={`support-page__filter-btn ${filterActive === undefined ? 'support-page__filter-btn--active' : ''}`}
        >
          Все
        </button>
        <button
          onClick={() => setFilterActive(true)}
          className={`support-page__filter-btn ${filterActive === true ? 'support-page__filter-btn--active' : ''}`}
        >
          Активные
        </button>
        <button
          onClick={() => setFilterActive(false)}
          className={`support-page__filter-btn ${filterActive === false ? 'support-page__filter-btn--active' : ''}`}
        >
          Закрытые
        </button>
      </div>

      <div className="support-page__layout">
        <div className="support-page__sidebar">
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
                <p className="support-page__request-client">
                  Клиент: {request.user?.name || 'Неизвестно'}
                </p>
                <p className="support-page__request-preview">
                  {request.messages?.[0]?.text || 'Нет сообщений'}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="support-page__chat">
          {currentRequest ? (
            <>
              <div className="support-page__chat-header">
                <div>
                  <h3>Обращение #{currentRequest.id}</h3>
                  <p
                    style={{
                      margin: '5px 0 0 0',
                      fontSize: '14px',
                      color: '#666'
                    }}
                  >
                    Клиент: {currentRequest.user?.name} (
                    {currentRequest.user?.email})
                  </p>
                </div>
                {currentRequest.isActive && (
                  <button
                    onClick={handleCloseRequest}
                    className="support-page__close-btn"
                  >
                    Закрыть обращение
                  </button>
                )}
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
                        {msg.author?.name || 'Клиент'}
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
                    placeholder="Введите ответ..."
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
            <div className="support-page__empty">Выберите обращение слева</div>
          )}
        </div>
      </div>
    </div>
  );
}
