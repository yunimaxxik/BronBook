import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import Header from './components/Header/Header';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import CatalogPage from './pages/CatalogPage/CatalogPage';
import BookDetailPage from './pages/BookDetailPage/BookDetailPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import AdminPage from './pages/AdminPage/AdminPage';

function App() {
  return (
    <BrowserRouter>
      <div
        style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
      >
        <Header />

        <main style={{ flex: 1, padding: '20px' }}>
          <Routes>
            {/* Публичные роуты (без Header внутри, но Header уже сверху) */}
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

        <footer
          style={{
            textAlign: 'center',
            padding: '20px',
            backgroundColor: '#f5f5f5',
            color: '#666',
            fontSize: '14px'
          }}
        >
          © 2026 BronBook. Дипломный проект Нетологии.
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
