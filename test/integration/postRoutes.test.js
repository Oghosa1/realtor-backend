import request from 'supertest';
import { app } from '../../src/app.js';
import { pool } from '../../src/config/db.js';

describe('Expert Listing API Endpoints (Integration)', () => {
  afterAll(async () => {
    await pool.end();
  });

  describe('Health Endpoint', () => {
    it('GET /health returns healthy status', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('healthy');
    });
  });

  describe('Posts Endpoints', () => {
    let createdPostId = '';

    it('GET /api/posts returns paginated feed posts matching Figma data', async () => {
      const res = await request(app).get('/api/posts?page=1&limit=10');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.posts).toBeDefined();
      expect(Array.isArray(res.body.data.posts)).toBe(true);
      expect(res.body.data.posts.length).toBeGreaterThan(0);
      expect(res.body.data.pagination).toBeDefined();
      expect(res.body.data.pagination.currentPage).toBe(1);
    });

    it('GET /api/posts?category=request filters posts correctly', async () => {
      const res = await request(app).get('/api/posts?category=request');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      res.body.data.posts.forEach((post) => {
        expect(post.category).toBe('request');
      });
    });

    it('POST /api/posts creates a new post successfully', async () => {
      const newPost = {
        content: 'Automated test property request in Victoria Island.',
        category: 'request',
        tag: 'Looking to Buy',
        location: 'Victoria Island, Lagos',
      };

      const res = await request(app).post('/api/posts').send(newPost);
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.content).toBe(newPost.content);
      expect(res.body.data.category).toBe(newPost.category);
      expect(res.body.data.id).toBeDefined();
      createdPostId = res.body.data.id;
    });

    it('POST /api/posts/:id/like toggles like on a post', async () => {
      expect(createdPostId).toBeTruthy();
      const res = await request(app).post(`/api/posts/${createdPostId}/like`);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.isLiked).toBe(true);
      expect(res.body.data.likesCount).toBe(1);

      // Toggle off
      const resUnlike = await request(app).post(`/api/posts/${createdPostId}/like`);
      expect(resUnlike.statusCode).toBe(200);
      expect(resUnlike.body.data.isLiked).toBe(false);
      expect(resUnlike.body.data.likesCount).toBe(0);
    });
  });

  describe('Comments Endpoints', () => {
    let targetPostId = 'b2222222-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

    it('GET /api/posts/:id/comments returns comments for a post', async () => {
      const res = await request(app).get(`/api/posts/${targetPostId}/comments`);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.comments)).toBe(true);
    });

    it('POST /api/posts/:id/comments adds a new comment to a post', async () => {
      const res = await request(app)
        .post(`/api/posts/${targetPostId}/comments`)
        .send({ text: 'Integration test comment: Great property!' });
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.text).toBe('Integration test comment: Great property!');
    });
  });

  describe('Stories Endpoints', () => {
    it('GET /api/stories returns stories list with user metadata', async () => {
      const res = await request(app).get('/api/stories');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });
});
