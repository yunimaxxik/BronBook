import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { api } from '../../api/axios';
import { Book } from '../../interfaces/Book';
import { createRental } from '../../features/rentals/rentalsSlice';
import './BookDetailPage.css';

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
    return <div className="book-detail">Загрузка...</div>;
  }

  return (
    <div className="book-detail">
      <button
        onClick={() => navigate(-1)}
        className="book-detail__back-btn"
      >
        ← Назад к каталогу
      </button>

      <div className="book-detail__content">
        {book.coverImage && (
          <img
            src={`http://localhost:3000${book.coverImage}`}
            alt={book.title}
            className="book-detail__image"
          />
        )}

        <div className="book-detail__info">
          <h1 className="book-detail__title">{book.title}</h1>
          <p className="book-detail__author">Автор: {book.author}</p>
          {book.year && <p>Год издания: {book.year}</p>}
          <p>
            Библиотека: <strong>{book.library?.name || 'Неизвестно'}</strong>
          </p>
          <p>Адрес: {book.library?.address || '—'}</p>
          <p
            className={`book-detail__status ${book.isAvailable ? 'book-detail__status--available' : 'book-detail__status--unavailable'}`}
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
        <div className="book-detail__rent-section">
          <h2>Забронировать книгу</h2>

          {message && (
            <div
              className={`book-detail__message book-detail__message--${messageType}`}
            >
              {message}
            </div>
          )}

          <form
            onSubmit={handleRent}
            className="book-detail__form"
          >
            <div className="book-detail__input-group">
              <label>Дата получения:</label>
              <input
                type="date"
                value={dateStart}
                onChange={(e) => setDateStart(e.target.value)}
                required
                className="book-detail__input"
              />
            </div>
            <div className="book-detail__input-group">
              <label>Дата возврата:</label>
              <input
                type="date"
                value={dateEnd}
                onChange={(e) => setDateEnd(e.target.value)}
                required
                min={dateStart}
                className="book-detail__input"
              />
            </div>
            <button
              type="submit"
              className="book-detail__submit-btn"
            >
              Забронировать
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
