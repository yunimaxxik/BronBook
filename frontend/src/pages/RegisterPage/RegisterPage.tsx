import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../features/auth/authSlice';
import { RootState, AppDispatch } from '../../store';

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
      navigate('/'); // После регистрации сразу на главную
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <div
        style={{
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '30px'
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
          Регистрация
        </h2>

        {error && (
          <div
            style={{
              padding: '10px',
              marginBottom: '15px',
              backgroundColor: '#ffe6e6',
              color: '#c00',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
        >
          <input
            type="email"
            name="email"
            placeholder="Email *"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />

          <input
            type="password"
            name="password"
            placeholder="Пароль * (мин. 6 символов)"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            style={{
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />

          <input
            type="text"
            name="name"
            placeholder="Имя *"
            value={formData.name}
            onChange={handleChange}
            required
            style={{
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />

          <input
            type="tel"
            name="contactPhone"
            placeholder="Телефон (необязательно)"
            value={formData.contactPhone}
            onChange={handleChange}
            style={{
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />

          <button
            type="submit"
            disabled={isLoading}
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
            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
          Уже есть аккаунт?{' '}
          <Link
            to="/login"
            style={{ color: '#007bff' }}
          >
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}
