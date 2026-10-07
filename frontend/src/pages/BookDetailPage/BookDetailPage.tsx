import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { api } from '../../api/axios';
import { Book } from '../../interfaces/Book';
import { createRental } from '../../features/rentals/rentalsSlice';

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  const [book, setBook] = useState<Book | null>(null);
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>(
    'success'
  );

  useEffect(() => {
    if (id) {
      api
        .get<Book>(`/api/common/books/${id}`)
        .then((res) => setBook(res.data))
        .catch(() => setMessage('Книга не найдена'));
    }
  }, [id]);

  const handleRent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!book) return;

    const result = await dispatch(
      createRental({
        bookId: book.id,
        libraryId: book.libraryId,
        dateStart,
        dateEnd
      })
    );

    if (createRental.fulfilled.match(result)) {
      setMessage('Книга успешно забронирована!');
      setMessageType('success');
      setDateStart('');
      setDateEnd('');
    } else {
      setMessage((result.payload as string) || 'Ошибка бронирования');
      setMessageType('error');
    }
  };

  if (!book) {
    return <div style={{ padding: '20px' }}>Загрузка...</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <button
        onClick={() => navigate(-1)}
        style={{ marginBottom: '20px', padding: '8px 16px', cursor: 'pointer' }}
      >
        ← Назад к каталогу
      </button>

      <div style={{ display: 'flex', gap: '30px' }}>
        {book.coverImage && (
          <img
            src={`http://localhost:3000${book.coverImage}`}
            alt={book.title}
            style={{
              width: '250px',
              height: '350px',
              objectFit: 'cover',
              borderRadius: '8px'
            }}
          />
        )}

        <div style={{ flex: 1 }}>
          <h1>{book.title}</h1>
          <p style={{ fontSize: '18px', color: '#666' }}>
            Автор: {book.author}
          </p>
          {book.year && <p>Год издания: {book.year}</p>}
          <p>
            Библиотека: <strong>{book.library?.name || 'Неизвестно'}</strong>
          </p>
          <p>Адрес: {book.library?.address || '—'}</p>
          <p
            style={{
              color: book.isAvailable ? 'green' : 'red',
              fontWeight: 'bold'
            }}
          >
            {book.isAvailable
              ? `Доступно: ${book.availableCopies} из ${book.totalCopies} экз.`
              : 'Все экземпляры забронированы'}
          </p>
          {book.description && (
            <p style={{ marginTop: '20px' }}>{book.description}</p>
          )}
        </div>
      </div>

      {user?.role === 'client' && book.isAvailable && (
        <div
          style={{
            marginTop: '30px',
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '8px'
          }}
        >
          <h2>Забронировать книгу</h2>

          {message && (
            <div
              style={{
                padding: '10px',
                marginBottom: '15px',
                backgroundColor:
                  messageType === 'success' ? '#e7f3ff' : '#ffe6e6',
                color: messageType === 'success' ? '#0066cc' : '#c00',
                borderRadius: '4px'
              }}
            >
              {message}
            </div>
          )}

          <form
            onSubmit={handleRent}
            style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
          >
            <div>
              <label>Дата получения:</label>
              <input
                type="date"
                value={dateStart}
                onChange={(e) => setDateStart(e.target.value)}
                required
                style={{ padding: '8px', width: '100%', marginTop: '5px' }}
              />
            </div>
            <div>
              <label>Дата возврата:</label>
              <input
                type="date"
                value={dateEnd}
                onChange={(e) => setDateEnd(e.target.value)}
                required
                min={dateStart}
                style={{ padding: '8px', width: '100%', marginTop: '5px' }}
              />
            </div>
            <button
              type="submit"
              style={{
                padding: '12px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Забронировать
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
