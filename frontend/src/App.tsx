import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import PostList from './pages/PostList';
import PostDetail from './pages/PostDetail';


export default function App() {
  return (
    <BrowserRouter>
      <nav>
        <div className="container">
          <Link to="/">📖 Blog Platform</Link>
          <Link to="/" className="nav-link">Összes bejegyzés</Link>
        </div>
      </nav>
      <main>
        <div className="container">
          <Routes>
            <Route path="/" element={<PostList />} />
            <Route path="/posts/:id" element={<PostDetail />} />
          </Routes>
        </div>
      </main>
    </BrowserRouter>
  );
}
