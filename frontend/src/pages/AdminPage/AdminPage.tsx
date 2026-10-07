import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchLibraries } from '../../features/books/booksSlice';
import { api } from '../../api/axios';
import './AdminPage.css';

export default function AdminPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { libraries } = useSelector((state: RootState) => state.books);
  const user = useSelector((state: RootState) => state.auth.user);

  const [activeTab, setActiveTab] = useState<'library' | 'book'>('library');

  // Форма библиотеки
  const [libName, setLibName] = useState('');
  const [libAddress, setLibAddress] = useState('');
  const [libDescription, setLibDescription] = useState('');

  // Форма книги
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [bookYear, setBookYear] = useState('');
  const [bookDescription, setBookDescription] = useState('');
  const [bookLibraryId, setBookLibraryId] = useState('');
  const [bookTotalCopies, setBookTotalCopies] = useState('1');
  const [bookCoverImage, setBookCoverImage] = useState<File | null>(null);

  const [message, setMessage] = useState('');

  useEffect(() => {
    dispatch(fetchLibraries());
  }, [dispatch]);

  const handleCreateLibrary = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/api/admin/libraries', {
        name: libName,
        address: libAddress,
        description: libDescription
      });
      setMessage('Библиотека успешно создана!');
      setLibName('');
      setLibAddress('');
      setLibDescription('');
      dispatch(fetchLibraries());
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Ошибка создания библиотеки');
    }
  };

  const handleCreateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', bookTitle);
      formData.append('author', bookAuthor);
      formData.append('year', bookYear);
      formData.append('description', bookDescription);
      formData.append('libraryId', bookLibraryId);
      formData.append('totalCopies', bookTotalCopies);
      if (bookCoverImage) formData.append('coverImage', bookCoverImage);

      await api.post('/api/admin/books', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage('Книга успешно создана!');
      setBookTitle('');
      setBookAuthor('');
      setBookYear('');
      setBookDescription('');
      setBookLibraryId('');
      setBookTotalCopies('1');
      setBookCoverImage(null);
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Ошибка создания книги');
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="admin-page__access-denied">
        Доступ запрещён. Требуются права администратора.
      </div>
    );
  }

  return (
    <div className="admin-page">
      <h1>Админ-панель</h1>

      {message && <div className="admin-page__message">{message}</div>}

      <div className="admin-page__tabs">
        <button
          className={`admin-page__tab-btn ${activeTab === 'library' ? 'admin-page__tab-btn--active' : ''}`}
          onClick={() => setActiveTab('library')}
        >
          Добавить библиотеку
        </button>
        <button
          className={`admin-page__tab-btn ${activeTab === 'book' ? 'admin-page__tab-btn--active' : ''}`}
          onClick={() => setActiveTab('book')}
        >
          Добавить книгу
        </button>
      </div>

      {activeTab === 'library' && (
        <form
          onSubmit={handleCreateLibrary}
          className="admin-page__form"
        >
          <input
            type="text"
            placeholder="Название библиотеки"
            value={libName}
            onChange={(e) => setLibName(e.target.value)}
            required
            className="admin-page__input"
          />
          <input
            type="text"
            placeholder="Адрес"
            value={libAddress}
            onChange={(e) => setLibAddress(e.target.value)}
            required
            className="admin-page__input"
          />
          <textarea
            placeholder="Описание"
            value={libDescription}
            onChange={(e) => setLibDescription(e.target.value)}
            className="admin-page__textarea"
          />
          <button
            type="submit"
            className="admin-page__submit-btn"
          >
            Создать библиотеку
          </button>
        </form>
      )}

      {activeTab === 'book' && (
        <form
          onSubmit={handleCreateBook}
          className="admin-page__form"
        >
          <input
            type="text"
            placeholder="Название книги"
            value={bookTitle}
            onChange={(e) => setBookTitle(e.target.value)}
            required
            className="admin-page__input"
          />
          <input
            type="text"
            placeholder="Автор"
            value={bookAuthor}
            onChange={(e) => setBookAuthor(e.target.value)}
            required
            className="admin-page__input"
          />
          <input
            type="number"
            placeholder="Год издания"
            value={bookYear}
            onChange={(e) => setBookYear(e.target.value)}
            className="admin-page__input"
          />
          <textarea
            placeholder="Описание"
            value={bookDescription}
            onChange={(e) => setBookDescription(e.target.value)}
            className="admin-page__textarea"
          />
          <select
            value={bookLibraryId}
            onChange={(e) => setBookLibraryId(e.target.value)}
            required
            className="admin-page__select"
          >
            <option value="">Выберите библиотеку</option>
            {libraries.map((lib) => (
              <option
                key={lib.id}
                value={lib.id}
              >
                {lib.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Количество экземпляров"
            value={bookTotalCopies}
            onChange={(e) => setBookTotalCopies(e.target.value)}
            min="1"
            required
            className="admin-page__input"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setBookCoverImage(e.target.files?.[0] || null)}
            className="admin-page__input"
          />
          <button
            type="submit"
            className="admin-page__submit-btn"
          >
            Создать книгу
          </button>
        </form>
      )}
    </div>
  );
}
