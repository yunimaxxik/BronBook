import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import {
  fetchBooks,
  fetchLibraries,
  setFilter,
  clearFilters
} from '../../features/books/booksSlice';

export default function CatalogPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { books, libraries, isLoading, filters } = useSelector(
    (state: RootState) => state.books
  );

  useEffect(() => {
    dispatch(fetchLibraries());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch, filters]);

  const handleSearch = () => {
    dispatch(fetchBooks());
  };

  const handleClear = () => {
    dispatch(clearFilters());
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1>Каталог книг</h1>

      {/* Фильтры */}
      <div
        style={{
          marginBottom: '30px',
          padding: '20px',
          border: '1px solid #ccc',
          borderRadius: '8px'
        }}
      >
        <h3>Фильтры</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px'
          }}
        >
          <input
            type="text"
            placeholder="Название книги"
            value={filters.title}
            onChange={(e) => dispatch(setFilter({ title: e.target.value }))}
            style={{ padding: '8px' }}
          />
          <input
            type="text"
            placeholder="Автор"
            value={filters.author}
            onChange={(e) => dispatch(setFilter({ author: e.target.value }))}
            style={{ padding: '8px' }}
          />
          <select
            value={filters.libraryId || ''}
            onChange={(e) =>
              dispatch(
                setFilter({
                  libraryId: e.target.value ? parseInt(e.target.value) : null
                })
              )
            }
            style={{ padding: '8px' }}
          >
            <option value="">Все библиотеки</option>
            {libraries.map((lib) => (
              <option
                key={lib.id}
                value={lib.id}
              >
                {lib.name}
              </option>
            ))}
          </select>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={filters.availableOnly}
              onChange={(e) =>
                dispatch(setFilter({ availableOnly: e.target.checked }))
              }
            />
            Только доступные
          </label>
        </div>
        <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
          <button
            onClick={handleSearch}
            style={{ padding: '8px 16px', cursor: 'pointer' }}
          >
            Искать
          </button>
          <button
            onClick={handleClear}
            style={{ padding: '8px 16px', cursor: 'pointer' }}
          >
            Сбросить
          </button>
        </div>
      </div>

      {/* Список книг */}
      {isLoading ? (
        <p>Загрузка...</p>
      ) : books.length === 0 ? (
        <p>Книги не найдены</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '20px'
          }}
        >
          {books.map((book) => (
            <Link
              key={book.id}
              to={`/books/${book.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div
                key={book.id}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '15px'
                }}
              >
                {book.coverImage && (
                  <img
                    src={`http://localhost:3000${book.coverImage}`}
                    alt={book.title}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                      marginBottom: '10px'
                    }}
                  />
                )}
                <h3 style={{ margin: '0 0 5px 0' }}>{book.title}</h3>
                <p style={{ margin: '0 0 5px 0', color: '#666' }}>
                  {book.author}
                </p>
                {book.year && (
                  <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}>
                    {book.year}
                  </p>
                )}
                <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}>
                  Библиотека: {book.library?.name || 'Неизвестно'}
                </p>
                <p
                  style={{
                    margin: '0',
                    fontSize: '14px',
                    color: book.isAvailable ? 'green' : 'red'
                  }}
                >
                  {book.isAvailable
                    ? `Доступно: ${book.availableCopies} из ${book.totalCopies}`
                    : 'Недоступно'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
