import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, Post } from '../api/client';

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', author: '' });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.getPosts()
      .then(setPosts)
      .catch(() => setError('Nem sikerült betölteni a bejegyzéseket.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;
    setSubmitting(true);
    try {
      const post = await api.createPost({
        title: form.title,
        content: form.content,
        author: form.author || 'Névtelen',
      });
      setPosts([post, ...posts]);
      setForm({ title: '', content: '', author: '' });
      setShowForm(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Hiba történt');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Betöltés...</div>;

  return (
    <div>
      <div className="page-header">
        <h1>📝 Blog bejegyzések</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Mégse' : '+ Új bejegyzés'}
        </button>
      </div>

      {error && <div className="error-msg">{error}</div>}

      {showForm && (
        <div className="form-card">
          <h2>Új bejegyzés létrehozása</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="author">Szerző neve</label>
              <input
                id="author"
                placeholder="Névtelen"
                value={form.author}
                onChange={e => setForm({ ...form, author: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="title">Cím *</label>
              <input
                id="title"
                required
                placeholder="A bejegyzés címe"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="content">Tartalom *</label>
              <textarea
                id="content"
                required
                placeholder="Írja ide a bejegyzés tartalmát..."
                value={form.content}
                onChange={e => setForm({ ...form, content: e.target.value })}
              />
            </div>
            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? 'Mentés...' : 'Bejegyzés létrehozása'}
            </button>
          </form>
        </div>
      )}

      {posts.length === 0 && !showForm ? (
        <div className="empty-state">
          <p>Még nincsenek bejegyzések.</p>
          <p>Hozd létre az elsőt!</p>
        </div>
      ) : (
        posts.map(post => (
          <div key={post.id} className="post-card" onClick={() => navigate(`/posts/${post.id}`)}>
            <h2>{post.title}</h2>
            <div className="post-meta">
              ✍️ {post.author} · {post.createdAt ? new Date(post.createdAt).toLocaleDateString('hu-HU') : 'Ismeretlen dátum'}
            </div>
            <p className="post-excerpt">
              {post.content.length > 150 ? post.content.slice(0, 150) + '...' : post.content}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
