import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../features/auth/authSlice';
import { RootState, AppDispatch } from '../../store';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    const result = await dispatch(login({ email, password }));

    if (login.fulfilled.match(result)) {
      navigate('/');
    }
  };

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: '50px auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px'
      }}
    >
      <h2>Вход в систему</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '8px' }}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: '8px' }}
        />
        <button
          type="submit"
          disabled={isLoading}
          style={{ padding: '10px', cursor: 'pointer' }}
        >
          {isLoading ? 'Вход...' : 'Войти'}
        </button>
      </form>
    </div>
  );
}
