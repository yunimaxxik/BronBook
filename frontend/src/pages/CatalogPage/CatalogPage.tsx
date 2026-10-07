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
import './CatalogPage.css';

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

  const handleSearch = () => dispatch(fetchBooks());
  const handleClear = () => dispatch(clearFilters());

  return (
    <div className="catalog">
      <h1>Каталог книг</h1>

      <div className="catalog__filters">
        <h3>Фильтры</h3>
        <div className="catalog__filters-grid">
          <input
            type="text"
            placeholder="Название книги"
            value={filters.title}
            onChange={(e) => dispatch(setFilter({ title: e.target.value }))}
            className="catalog__input"
          />
          <input
            type="text"
            placeholder="Автор"
            value={filters.author}
            onChange={(e) => dispatch(setFilter({ author: e.target.value }))}
            className="catalog__input"
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
            className="catalog__select"
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
          <label className="catalog__checkbox-label">
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
        <div className="catalog__buttons">
          <button
            onClick={handleSearch}
            className="catalog__btn catalog__btn--primary"
          >
            Искать
          </button>
          <button
            onClick={handleClear}
            className="catalog__btn"
          >
            Сбросить
          </button>
        </div>
      </div>

      {isLoading ? (
        <p>Загрузка...</p>
      ) : books.length === 0 ? (
        <p>Книги не найдены</p>
      ) : (
        <div className="catalog__grid">
          {books.map((book) => (
            <Link
              key={book.id}
              to={`/books/${book.id}`}
              className="catalog__card"
            >
              {book.coverImage && (
                <img
                  src={`http://localhost:3000${book.coverImage}`}
                  alt={book.title}
                  className="catalog__card-image"
                />
              )}
              <h3 className="catalog__card-title">{book.title}</h3>
              <p className="catalog__card-author">{book.author}</p>
              {book.year && <p className="catalog__card-meta">{book.year}</p>}
              <p className="catalog__card-meta">
                Библиотека: {book.library?.name || 'Неизвестно'}
              </p>
              <p
                className={`catalog__card-status ${book.isAvailable ? 'catalog__card-status--available' : 'catalog__card-status--unavailable'}`}
              >
                {book.isAvailable
                  ? `Доступно: ${book.availableCopies} из ${book.totalCopies}`
                  : 'Недоступно'}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
