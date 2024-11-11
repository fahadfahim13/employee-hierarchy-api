import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { User } from '../auth/entities/user.entity';
import { Employee } from '../employee/entities/employee.entity';

dotenv.config();

const configService = new ConfigService();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE'),
  entities: [User, Employee], // Explicitly specify entities
//   entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
  migrationsRun: false,
  migrationsTableName: 'migrations',
  metadataTableName: 'typeorm_metadata',
  poolSize: 100,
  extra: {
    // Connection pool settings
    max: 100,
    min: 10,
    idle: 10000,
    acquire: 60000,
    connectionTimeoutMillis: 10000,
    // Query execution timeout
    statement_timeout: 10000,
  },
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;