import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api, PostWithComments } from '../api/client';

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<PostWithComments | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comment, setComment] = useState({ content: '', author: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!id) return;
    api.getPost(Number(id))
      .then(setPost)
      .catch(() => setError('A bejegyzés nem található.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.content.trim() || !post) return;
    setSubmitting(true);
    setSuccess('');
    try {
      const newComment = await api.addComment(post.id, {
        content: comment.content,
        author: comment.author || 'Névtelen',
      });
      setPost({ ...post, comments: [...post.comments, newComment] });
      setComment({ content: '', author: '' });
      setSuccess('Komment sikeresen hozzáadva!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Hiba a komment mentésekor');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Betöltés...</div>;
  if (error) return (
    <div>
      <Link to="/" className="back-link">← Vissza</Link>
      <div className="error-msg">{error}</div>
    </div>
  );
  if (!post) return null;

  return (
    <div>
      <Link to="/" className="back-link">← Vissza a listához</Link>

      <div className="post-detail">
        <h1>{post.title}</h1>
        <div className="post-meta">
          ✍️ {post.author} · {post.createdAt ? new Date(post.createdAt).toLocaleString('hu-HU') : 'Ismeretlen dátum'}
        </div>
        <p className="post-content">{post.content}</p>
      </div>

      <div className="comments-section">
        <h2>💬 Kommentek ({post.comments.length})</h2>
        {post.comments.length === 0 ? (
          <p className="empty-state">Még nincs komment. Legyél az első!</p>
        ) : (
          post.comments.map(c => (
            <div key={c.id} className="comment">
              <span className="comment-author">{c.author}</span>
              <span className="comment-date">{c.createdAt ? new Date(c.createdAt).toLocaleString('hu-HU') : 'Ismeretlen dátum'}</span>
              <p className="comment-content">{c.content}</p>
            </div>
          ))
        )}
      </div>

      <div className="form-card">
        <h2>Komment hozzáadása</h2>
        {success && <div className="success-msg">{success}</div>}
        <form onSubmit={handleComment}>
          <div className="form-group">
            <label htmlFor="commentAuthor">Neved</label>
            <input
              id="commentAuthor"
              placeholder="Névtelen"
              value={comment.author}
              onChange={e => setComment({ ...comment, author: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="commentContent">Komment *</label>
            <textarea
              id="commentContent"
              required
              placeholder="Írj kommentet..."
              value={comment.content}
              onChange={e => setComment({ ...comment, content: e.target.value })}
            />
          </div>
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? 'Küldés...' : 'Komment küldése'}
          </button>
        </form>
      </div>
    </div>
  );
}
