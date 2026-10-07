// frontend/src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import Header from './components/Header/Header';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import CatalogPage from './pages/CatalogPage/CatalogPage';
import BookDetailPage from './pages/BookDetailPage/BookDetailPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import AdminPage from './pages/AdminPage/AdminPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Header />

        <main className="app-main">
          <Routes>
            {/* Публичные роуты */}
            <Route
              path="/login"
              element={<LoginPage />}
            />
            <Route
              path="/register"
              element={<RegisterPage />}
            />

            {/* Защищенные роуты */}
            <Route element={<ProtectedRoute />}>
              <Route
                path="/"
                element={<CatalogPage />}
              />
              <Route
                path="/books/:id"
                element={<BookDetailPage />}
              />
              <Route
                path="/profile"
                element={<ProfilePage />}
              />
              <Route
                path="/admin"
                element={<AdminPage />}
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
        </main>

        <footer className="app-footer">
          © 2026 BronBook. Дипломный проект Нетологии.
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
