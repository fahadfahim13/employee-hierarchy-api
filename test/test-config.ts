import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../src/auth/entities/user.entity';
import { Employee } from '../src/employee/entities/employee.entity';

export const testConfig = {
  database: {
    host: 'localhost',
    port: 5433,
    username: 'root',  // Update with your local postgres username
    password: 'root',  // Update with your local postgres password
    database: 'employee'
  },
  jwt: {
    secret: 'test-secret-key',
    expiresIn: '1h'
  }
};

export const testTypeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: testConfig.database.host,
  port: testConfig.database.port,
  username: testConfig.database.username,
  password: testConfig.database.password,
  database: testConfig.database.database,
  entities: [User, Employee],
  synchronize: true, // Only for testing
  logging: false
};