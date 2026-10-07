// frontend/src/components/Header.tsx
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { logout } from '../../features/auth/authSlice';
import './Header.css'; // <-- Импортируем CSS файл

export default function Header() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header__left">
        <Link
          to="/"
          className="header__logo"
        >
          <img src="../../assets/books.svg" />
          BronBook
        </Link>

        {user && (
          <nav className="header__nav">
            <Link
              to="/"
              className="header__nav-link"
            >
              Каталог
            </Link>
            <Link
              to="/profile"
              className="header__nav-link"
            >
              Мои аренды
            </Link>
            <Link
              to="/support"
              className="header__nav-link"
            >
              Поддержка
            </Link>
            {user.role === 'admin' && (
              <Link
                to="/admin"
                className="header__nav-link header__nav-link--admin"
              >
                Админ-панель
              </Link>
            )}
            {user.role === 'manager' && (
              <Link
                to="/manager"
                className="header__nav-link header__nav-link--manager"
              >
                Панель менеджера
              </Link>
            )}
          </nav>
        )}
      </div>

      <div className="header__right">
        {user ? (
          <>
            <span className="header__user-info">
              Привет, <strong>{user.name}</strong>!
              <span className="header__user-role">({user.role})</span>
            </span>
            <button
              onClick={handleLogout}
              className="header__logout-btn"
            >
              Выйти
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="header__login-link"
            >
              Вход
            </Link>
            <Link
              to="/register"
              className="header__register-link"
            >
              Регистрация
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
