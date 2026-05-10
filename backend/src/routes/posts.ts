import { Router, Request, Response } from 'express';
import { db } from '../db';
import { posts, comments } from '../db/schema';
import { eq } from 'drizzle-orm';

const router = Router();

// GET /api/posts - összes bejegyzés listázása
router.get('/', (_req: Request, res: Response) => {
  const allPosts = db.select().from(posts).orderBy(posts.id).all();
  res.json(allPosts);
});

// GET /api/posts/:id - egy bejegyzés kommentekkel
router.get('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Érvénytelen azonosító' });
  }

  const post = db.select().from(posts).where(eq(posts.id, id)).get();
  if (!post) {
    return res.status(404).json({ error: 'Bejegyzés nem található' });
  }

  const postComments = db.select().from(comments).where(eq(comments.postId, id)).all();
  return res.json({ ...post, comments: postComments });
});

// POST /api/posts - új bejegyzés létrehozása
router.post('/', (req: Request, res: Response) => {
  const { title, content, author } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'A cím megadása kötelező' });
  }
  if (!content || typeof content !== 'string' || content.trim() === '') {
    return res.status(400).json({ error: 'A tartalom megadása kötelező' });
  }

  const newPost = db
    .insert(posts)
    .values({ title: title.trim(), content: content.trim(), author: author?.trim() || 'Névtelen' })
    .returning()
    .get();

  return res.status(201).json(newPost);
});

// POST /api/posts/:id/comments - komment hozzáadása
router.post('/:id/comments', (req: Request, res: Response) => {
  const postId = parseInt(req.params.id);
  if (isNaN(postId)) {
    return res.status(400).json({ error: 'Érvénytelen bejegyzés-azonosító' });
  }

  const post = db.select().from(posts).where(eq(posts.id, postId)).get();
  if (!post) {
    return res.status(404).json({ error: 'Bejegyzés nem található' });
  }

  const { content, author } = req.body;
  if (!content || typeof content !== 'string' || content.trim() === '') {
    return res.status(400).json({ error: 'A komment tartalma kötelező' });
  }

  const newComment = db
    .insert(comments)
    .values({ postId, content: content.trim(), author: author?.trim() || 'Névtelen' })
    .returning()
    .get();

  return res.status(201).json(newComment);
});

export default router;
