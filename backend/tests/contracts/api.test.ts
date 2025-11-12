import request from 'supertest';
import { app } from '../../src/server';

describe('API Contract Tests', () => {
  describe('Health Check', () => {
    it('GET /health should return 200', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('API Root', () => {
    it('GET /api/v1 should return API info', async () => {
      const response = await request(app).get('/api/v1');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('endpoints');
    });
  });

  describe('Articles Endpoint', () => {
    it('GET /api/v1/articles should return paginated list', async () => {
      const response = await request(app).get('/api/v1/articles');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('GET /api/v1/articles with pagination params', async () => {
      const response = await request(app)
        .get('/api/v1/articles')
        .query({ page: 1, per_page: 10 });
      expect(response.status).toBe(200);
      expect(response.body.pagination.per_page).toBeLessThanOrEqual(10);
    });

    it('POST /api/v1/articles without auth should return 401', async () => {
      const response = await request(app)
        .post('/api/v1/articles')
        .send({ title: 'Test', content: 'Test content' });
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Authors Endpoint', () => {
    it('GET /api/v1/authors should return list', async () => {
      const response = await request(app).get('/api/v1/authors');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
    });
  });

  describe('Deprecation Redirects', () => {
    it('GET /api/auth should redirect to /api/v1/auth', async () => {
      const response = await request(app)
        .get('/api/auth')
        .redirects(0);
      expect(response.status).toBe(307);
      expect(response.headers).toHaveProperty('deprecation');
      expect(response.headers).toHaveProperty('sunset');
    });
  });

  describe('Error Responses', () => {
    it('404 endpoints should return standard error format', async () => {
      const response = await request(app).get('/api/v1/nonexistent');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('code');
      expect(response.body.error).toHaveProperty('message');
    });
  });

  describe('Request ID Header', () => {
    it('All responses should include X-Request-ID', async () => {
      const response = await request(app).get('/health');
      expect(response.headers).toHaveProperty('x-request-id');
    });
  });
});
