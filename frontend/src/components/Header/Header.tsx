import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { logout } from '../../features/auth/authSlice';

export default function Header() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  return (
    <header
      style={{
        backgroundColor: '#1a1a2e',
        color: 'white',
        padding: '15px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
        <Link
          to="/"
          style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '20px',
            fontWeight: 'bold'
          }}
        >
          📚 BronBook
        </Link>

        {user && (
          <nav style={{ display: 'flex', gap: '20px' }}>
            <Link
              to="/"
              style={{ color: 'white', textDecoration: 'none' }}
            >
              Каталог
            </Link>
            <Link
              to="/profile"
              style={{ color: 'white', textDecoration: 'none' }}
            >
              Мои аренды
            </Link>
            {user.role === 'admin' && (
              <Link
                to="/admin"
                style={{ color: '#ffd700', textDecoration: 'none' }}
              >
                Админ-панель
              </Link>
            )}
            {user.role === 'manager' && (
              <Link
                to="/manager"
                style={{ color: '#90ee90', textDecoration: 'none' }}
              >
                Панель менеджера
              </Link>
            )}
          </nav>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {user ? (
          <>
            <span style={{ fontSize: '14px' }}>
              Привет, <strong>{user.name}</strong>!
              <span
                style={{ marginLeft: '8px', fontSize: '12px', color: '#aaa' }}
              >
                ({user.role})
              </span>
            </span>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Выйти
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              style={{ color: 'white', textDecoration: 'none' }}
            >
              Вход
            </Link>
            <Link
              to="/register"
              style={{
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px'
              }}
            >
              Регистрация
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
