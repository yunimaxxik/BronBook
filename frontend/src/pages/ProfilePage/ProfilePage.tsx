import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchRentals } from '../../features/rentals/rentalsSlice';
import type { RentalStatus } from '../../interfaces/Rental';
import './ProfilePage.css';

const statusLabels: Record<RentalStatus, { text: string; color: string }> = {
  reserved: { text: 'Забронирована', color: '#ffa500' },
  active: { text: 'Активна', color: '#007bff' },
  completed: { text: 'Завершена', color: '#28a745' },
  cancelled: { text: 'Отменена', color: '#dc3545' }
};

export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { rentals, isLoading } = useSelector(
    (state: RootState) => state.rentals
  );

  useEffect(() => {
    dispatch(fetchRentals());
  }, [dispatch]);

  return (
    <div className="profile">
      <h1>Мои аренды</h1>

      {isLoading ? (
        <p>Загрузка...</p>
      ) : rentals.length === 0 ? (
        <p className="profile__empty">
          У вас пока нет аренд. <Link to="/">Перейти в каталог</Link>
        </p>
      ) : (
        <div className="profile__list">
          {rentals.map((rental) => {
            const status = statusLabels[rental.status];
            return (
              <div
                key={rental.id}
                className="profile__item"
              >
                <div className="profile__item-info">
                  <h3 className="profile__item-title">
                    {rental.book?.title || `Книга #${rental.bookId}`}
                  </h3>
                  <p className="profile__item-author">{rental.book?.author}</p>
                  <p className="profile__item-library">
                    Библиотека: {rental.book?.library?.name || '—'}
                  </p>
                </div>

                <div className="profile__item-meta">
                  <p className="profile__item-dates">
                    с {new Date(rental.dateStart).toLocaleDateString('ru-RU')}{' '}
                    по {new Date(rental.dateEnd).toLocaleDateString('ru-RU')}
                  </p>
                  <span
                    className="profile__badge"
                    style={{ backgroundColor: status.color }}
                  >
                    {status.text}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
