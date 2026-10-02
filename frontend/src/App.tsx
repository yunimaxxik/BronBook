import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRouter';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Публичные роуты */}
        <Route
          path="/login"
          element={<LoginPage />}
        />
        <Route
          path="/register"
          element={<div>Страница регистрации (сделай по аналогии с Login)</div>}
        />

        {/* Защищенные роуты */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/"
            element={<div>Главная страница (Каталог книг)</div>}
          />
          <Route
            path="/profile"
            element={<div>Личный кабинет</div>}
          />
        </Route>

        {/* Fallback */}
        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
