import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../src/auth/auth.module';
import { EmployeeModule } from '../src/employee/employee.module';
import { testTypeOrmConfig, testConfig } from './test-config';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import * as bcrypt from 'bcrypt';


export async function createTestingApp() {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        load: [() => ({
          database: testConfig.database,
          jwt: testConfig.jwt
        })]
      }),
      TypeOrmModule.forRoot(testTypeOrmConfig),
      JwtModule.register({
        secret: testConfig.jwt.secret,
        signOptions: { expiresIn: testConfig.jwt.expiresIn },
      }),
      AuthModule,
      EmployeeModule,
    ],
  }).compile();

  const app = moduleFixture.createNestApplication();
  app.useGlobalPipes(new ValidationPipe());
  await app.init();

  return app;
}

export async function cleanupDatabase(app: INestApplication) {
  if (!app) return;

  try {
    const connection = app.get('Connection');
    await connection.synchronize(true); // This will drop and recreate all tables
  } catch (error) {
    console.error('Error cleaning up database:', error);
  }
}

export async function createTestUser(app: INestApplication) {
    const authService = app.get(AuthService);
    const userRepo = app.get<Repository<User>>(getRepositoryToken(User));
  
    const testUser = await userRepo.save({
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 10),
      name: 'Test User',
    });
  
    const { access_token } = await authService.login({
      email: 'test@example.com',
      password: 'password123',
    });
  
    return { user: testUser, token: access_token };
  }