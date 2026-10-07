import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../features/auth/authSlice';
import { RootState, AppDispatch } from '../../store';
import './RegisterPage.css';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    contactPhone: ''
  });
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(register(formData));
    if (register.fulfilled.match(result)) {
      navigate('/');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Регистрация</h2>
        {error && <div className="auth-error">{error}</div>}
        <form
          onSubmit={handleSubmit}
          className="auth-form"
        >
          <input
            type="email"
            name="email"
            placeholder="Email *"
            value={formData.email}
            onChange={handleChange}
            required
            className="auth-input"
          />
          <input
            type="password"
            name="password"
            placeholder="Пароль * (мин. 6 символов)"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            className="auth-input"
          />
          <input
            type="text"
            name="name"
            placeholder="Имя *"
            value={formData.name}
            onChange={handleChange}
            required
            className="auth-input"
          />
          <input
            type="tel"
            name="contactPhone"
            placeholder="Телефон (необязательно)"
            value={formData.contactPhone}
            onChange={handleChange}
            className="auth-input"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="auth-btn"
          >
            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>
        <p className="auth-footer">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </div>
    </div>
  );
}
