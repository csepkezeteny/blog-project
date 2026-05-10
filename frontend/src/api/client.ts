const BASE = '/api';

export interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

export interface Comment {
  id: number;
  post_id: number;
  author: string;
  content: string;
  createdAt: string;
}

export interface PostWithComments extends Post {
  comments: Comment[];
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Ismeretlen hiba' }));
    throw new Error(err.error || 'Hiba történt');
  }
  return res.json() as Promise<T>;
}

export const api = {
  getPosts: (): Promise<Post[]> =>
    fetch(`${BASE}/posts`).then(res => handleResponse<Post[]>(res)),

  getPost: (id: number): Promise<PostWithComments> =>
    fetch(`${BASE}/posts/${id}`).then(res => handleResponse<PostWithComments>(res)),

  createPost: (data: { title: string; content: string; author: string }): Promise<Post> =>
    fetch(`${BASE}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(res => handleResponse<Post>(res)),

  addComment: (postId: number, data: { content: string; author: string }): Promise<Comment> =>
    fetch(`${BASE}/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(res => handleResponse<Comment>(res)),
};