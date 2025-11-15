import request from 'supertest';
import app from '../../src/app';
import { resetTestDatabase } from '../utils/test-db';

jest.setTimeout(60_000);

beforeAll(async () => {
  await resetTestDatabase();
});

beforeEach(async () => {
  await resetTestDatabase();
});

describe('Auth endpoints', () => {
  it('registers a new user and returns token', async () => {
    const response = await request(app).post('/api/auth/register').send({
      email: 'new-user@example.com',
      password: 'Password123',
    });

    expect(response.status).toBe(201);
    expect(response.body.token).toBeDefined();
    expect(response.body.user.email).toBe('new-user@example.com');
    expect(response.body.user).not.toHaveProperty('password_hash');
  });

  it('rejects duplicate registrations', async () => {
    await request(app).post('/api/auth/register').send({
      email: 'dupe@example.com',
      password: 'Password123',
    });

    const response = await request(app).post('/api/auth/register').send({
      email: 'dupe@example.com',
      password: 'Password123',
    });

    expect(response.status).toBe(409);
  });

  it('validates password strength on registration', async () => {
    const response = await request(app).post('/api/auth/register').send({
      email: 'weak@example.com',
      password: 'short',
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Validation failed');
  });

  it('logs in an existing user', async () => {
    await request(app).post('/api/auth/register').send({
      email: 'login@example.com',
      password: 'Password123',
    });

    const response = await request(app).post('/api/auth/login').send({
      email: 'login@example.com',
      password: 'Password123',
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  it('returns 401 for invalid credentials', async () => {
    await request(app).post('/api/auth/register').send({
      email: 'wrong@example.com',
      password: 'Password123',
    });

    const response = await request(app).post('/api/auth/login').send({
      email: 'wrong@example.com',
      password: 'BadPassword',
    });

    expect(response.status).toBe(401);
  });
});

