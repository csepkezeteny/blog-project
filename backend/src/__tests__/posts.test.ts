import request from 'supertest';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Teszteléshez memória-adatbázist használunk
process.env.DB_PATH = ':memory:';

import app from '../app';

describe('Posts API - Integráció tesztek', () => {
  describe('GET /api/posts', () => {
    it('üres lista esetén 200-at és tömböt ad vissza', async () => {
      const res = await request(app).get('/api/posts');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('POST /api/posts', () => {
    it('új bejegyzést hoz létre helyes adatokkal', async () => {
      const res = await request(app)
        .post('/api/posts')
        .send({ title: 'Teszt cím', content: 'Teszt tartalom', author: 'Teszt Szerző' });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.title).toBe('Teszt cím');
      expect(res.body.content).toBe('Teszt tartalom');
      expect(res.body.author).toBe('Teszt Szerző');
    });

    it('400-at ad vissza ha hiányzik a cím', async () => {
      const res = await request(app)
        .post('/api/posts')
        .send({ content: 'Tartalom cím nélkül' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('400-at ad vissza ha hiányzik a tartalom', async () => {
      const res = await request(app)
        .post('/api/posts')
        .send({ title: 'Cím tartalom nélkül' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /api/posts/:id', () => {
    it('visszaadja a bejegyzést kommentekkel együtt', async () => {
      // Először létrehozunk egy bejegyzést
      const createRes = await request(app)
        .post('/api/posts')
        .send({ title: 'Részletes teszt', content: 'Tartalom', author: 'Szerző' });

      const postId = createRes.body.id;

      const res = await request(app).get(`/api/posts/${postId}`);
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(postId);
      expect(Array.isArray(res.body.comments)).toBe(true);
    });

    it('404-et ad vissza nem létező bejegyzésnél', async () => {
      const res = await request(app).get('/api/posts/99999');
      expect(res.status).toBe(404);
    });

    it('400-at ad vissza érvénytelen id-nél', async () => {
      const res = await request(app).get('/api/posts/nem-szam');
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/posts/:id/comments', () => {
    it('kommentet ad hozzá egy bejegyzéshez', async () => {
      const createRes = await request(app)
        .post('/api/posts')
        .send({ title: 'Komment teszt', content: 'Tartalom' });

      const postId = createRes.body.id;

      const res = await request(app)
        .post(`/api/posts/${postId}/comments`)
        .send({ content: 'Ez egy komment', author: 'Kommentelő' });

      expect(res.status).toBe(201);
      expect(res.body.content).toBe('Ez egy komment');
      expect(res.body.postId).toBe(postId);
    });

    it('400-at ad vissza üres komment tartalommal', async () => {
      const createRes = await request(app)
        .post('/api/posts')
        .send({ title: 'Komment validáció teszt', content: 'Tartalom' });

      const postId = createRes.body.id;

      const res = await request(app)
        .post(`/api/posts/${postId}/comments`)
        .send({ content: '' });

      expect(res.status).toBe(400);
    });
  });
});
