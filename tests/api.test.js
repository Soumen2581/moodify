/**
 * Loads `src/app` only (not `server.js`) — no Mongo connection.
 */
const request = require('supertest');

describe('HTTP API', () => {
  let app;

  beforeAll(() => {
    process.env.JWT_SECRET = 'test-jwt-secret-for-unit-tests';
    delete process.env.YOUTUBE_API_KEY;
    app = require('../src/app');
  });

  beforeEach(() => {
    delete process.env.YOUTUBE_API_KEY;
  });

  test('GET /api/bootstrap returns moods and youtubeConfigured false without key', async () => {
    const res = await request(app).get('/api/bootstrap').expect(200);
    expect(Array.isArray(res.body.moods)).toBe(true);
    expect(res.body.moods.length).toBeGreaterThan(0);
    expect(res.body.youtubeConfigured).toBe(false);
  });

  test('GET /api/moods matches bootstrap mood list', async () => {
    const boot = await request(app).get('/api/bootstrap');
    const moods = await request(app).get('/api/moods');
    expect(moods.status).toBe(200);
    expect(moods.body).toEqual(boot.body.moods);
  });

  test('GET /api/moods/recommend without API key → 503', async () => {
    const res = await request(app).get('/api/moods/recommend?mood=happy').expect(503);
    expect(res.body.error).toMatch(/YOUTUBE_API_KEY/i);
  });

  test('GET /api/moods/recommend unknown mood → 400 (before YouTube call)', async () => {
    process.env.YOUTUBE_API_KEY = 'dummy-key-not-used-for-unknown-mood';
    const res = await request(app).get('/api/moods/recommend?mood=notamoodxyz').expect(400);
    expect(res.body.error).toMatch(/Unknown mood/i);
  });

  test('GET /api/music-config reflects key presence', async () => {
    process.env.YOUTUBE_API_KEY = 'x';
    const on = await request(app).get('/api/music-config');
    expect(on.body.youtubeConfigured).toBe(true);
    delete process.env.YOUTUBE_API_KEY;
    const off = await request(app).get('/api/music-config');
    expect(off.body.youtubeConfigured).toBe(false);
  });
});
