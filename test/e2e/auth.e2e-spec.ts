import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestingApp, cleanupDatabase } from '../test-utils';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const testApp = await createTestingApp();
    app = testApp;
  }, 30000);

  afterAll(async () => {
    await cleanupDatabase(app);
    await app?.close();
  });

  beforeEach(async () => {
    await cleanupDatabase(app);
  });

  describe('Authentication', () => {
    it('should register a new user', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(201);

      expect(response.body.id).toBeDefined();
      expect(response.body.email).toBe('test@example.com');
      expect(response.body.password).toBeUndefined();
    });

    it('should login and return JWT token', async () => {
      // First register a user
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      // Then try to login
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(200);

      expect(response.body.access_token).toBeDefined();
    });
  });
});