import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { Employee } from './entities/employee.entity';
import { AuthModule } from '../auth/auth.module';
import { CustomLogger } from 'src/logging/logger.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([Employee]),
    AuthModule,
  ],
  controllers: [EmployeeController],
  providers: [CustomLogger, EmployeeService],
})
export class EmployeeModule {}