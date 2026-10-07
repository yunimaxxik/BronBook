import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchRentals } from '../../features/rentals/rentalsSlice';
import type { RentalStatus } from '../../interfaces/Rental';

const statusLabels: Record<RentalStatus, { text: string; color: string }> = {
  reserved: { text: 'Забронирована', color: '#ffa500' },
  active: { text: 'Активна', color: '#007bff' },
  completed: { text: 'Завершена', color: 'green' },
  cancelled: { text: 'Отменена', color: 'red' }
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
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <h1>Мои аренды</h1>

      {isLoading ? (
        <p>Загрузка...</p>
      ) : rentals.length === 0 ? (
        <p>
          У вас пока нет аренд. <a href="/">Перейти в каталог</a>
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {rentals.map((rental) => {
            const status = statusLabels[rental.status];
            return (
              <div
                key={rental.id}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <h3 style={{ margin: '0 0 5px 0' }}>
                    {rental.book?.title || `Книга #${rental.bookId}`}
                  </h3>
                  <p style={{ margin: '0 0 5px 0', color: '#666' }}>
                    {rental.book?.author}
                  </p>
                  <p style={{ margin: '0', fontSize: '14px', color: '#888' }}>
                    Библиотека: {rental.book?.library?.name || '—'}
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}>
                    с {new Date(rental.dateStart).toLocaleDateString('ru-RU')}{' '}
                    по {new Date(rental.dateEnd).toLocaleDateString('ru-RU')}
                  </p>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      backgroundColor: status.color,
                      color: 'white',
                      borderRadius: '12px',
                      fontSize: '12px'
                    }}
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
