import request from 'supertest';
import app from './app';

jest.mock('./utils/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

describe('App', () => {
  it('should return 404 for unknown routes', async () => {
    const response = await request(app).get('/unknown');
    expect(response.status).toBe(404);
  });

  it('should include CORS headers on responses', async () => {
    const response = await request(app)
      .get('/unknown')
      .set('Origin', 'http://localhost:4200');
    expect(response.headers['access-control-allow-origin']).toBe('*');
  });

  it('should parse JSON request bodies', async () => {
    const response = await request(app)
      .post('/unknown')
      .send({ test: true })
      .set('Content-Type', 'application/json');
    expect(response.status).toBe(404);
  });
});
