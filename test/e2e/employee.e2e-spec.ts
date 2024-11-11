import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../../src/employee/entities/employee.entity';
import { User } from '../../src/auth/entities/user.entity';
import { createTestingApp, cleanupDatabase, createTestUser } from '../test-utils';

describe('EmployeeController (e2e)', () => {
  let app: INestApplication;
  let employeeRepository: Repository<Employee>;
  let userRepository: Repository<User>;
  let jwtToken: string;

  beforeAll(async () => {
    const testApp = await createTestingApp();
    app = testApp;
    
    employeeRepository = app.get<Repository<Employee>>(getRepositoryToken(Employee));
    userRepository = app.get<Repository<User>>(getRepositoryToken(User));

    // Create test user and get JWT token
    const { token } = await createTestUser(app);
    jwtToken = token;
  }, 30000); // Increase timeout for beforeAll

  afterAll(async () => {
    await cleanupDatabase(app);
    await app?.close();
  });

  beforeEach(async () => {
    await cleanupDatabase(app);
  });

  describe('/employees (POST)', () => {
    it('should create a new employee', async () => {
      const createEmployeeDto = {
        name: 'John Doe',
        positionId: 1,
        positionName: 'CTO',
      };

      const response = await request(app.getHttpServer())
        .post('/employees')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(createEmployeeDto)
        .expect(201);

      expect(response.body).toMatchObject(createEmployeeDto);
      expect(response.body.id).toBeDefined();
    });

    it('should fail to create employee without authentication', async () => {
      const createEmployeeDto = {
        name: 'John Doe',
        positionId: 1,
        positionName: 'CTO',
      };

      await request(app.getHttpServer())
        .post('/employees')
        .send(createEmployeeDto)
        .expect(401);
    });
  });

  describe('/employees/hierarchy/:id (GET)', () => {
    beforeEach(async () => {
      // Create test hierarchy
      const cto = await employeeRepository.save({
        name: 'John Doe',
        positionId: 1,
        positionName: 'CTO',
      });

      await employeeRepository.save({
        name: 'Jane Smith',
        positionId: 2,
        positionName: 'Senior Engineer',
        managerId: cto.id,
      });
    });

    it('should return employee hierarchy', async () => {
      const response = await request(app.getHttpServer())
        .get('/employees/hierarchy/1')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body[0].positionName).toBe('Senior Engineer');
    });

    it('should return 404 for non-existent manager', async () => {
      await request(app.getHttpServer())
        .get('/employees/hierarchy/999')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(404);
    });
  });
});