import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './entities/employee.entity';
import { CustomLogger } from '../logging/logger.service';

@Injectable()
export class EmployeeService {
  constructor(
    private readonly logger: CustomLogger,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    this.logger.debug(`Creating employee: ${JSON.stringify(createEmployeeDto)}`, 'EmployeeService');
    const employee = this.employeeRepository.create(createEmployeeDto);
    this.logger.debug(`Creating employee: ${JSON.stringify(employee)}`, 'EmployeeService');
    return await this.employeeRepository.save(employee);
  }

  async findOne(id: number): Promise<Employee> {
    this.logger.debug(`Finding employee by id: ${id}`, 'EmployeeService');
    const employee = await this.employeeRepository.findOne({ where: { id } });
    this.logger.debug(`Found employee: ${JSON.stringify(employee)}`, 'EmployeeService');
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    return employee;
  }

  async findAll(): Promise<Employee[]> {
    this.logger.debug(`Finding all employees`, 'EmployeeService');
    const employees = await this.employeeRepository.find();
    this.logger.debug(`Found employees: ${JSON.stringify(employees)}`, 'EmployeeService');
    if (!employees) {
      throw new NotFoundException(`Employee list not found`);
    }
    return employees;
  }


  async update(id: number, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee> {
    this.logger.debug(`Updating employee: ${JSON.stringify(updateEmployeeDto)}`, 'EmployeeService');
    const employee = await this.findOne(id);
    this.logger.debug(`Found employee: ${JSON.stringify(employee)}`, 'EmployeeService');
    const updatedEmployee = this.employeeRepository.merge(employee, updateEmployeeDto);
    this.logger.debug(`Updated employee: ${JSON.stringify(updatedEmployee)}`, 'EmployeeService');
    return await this.employeeRepository.save(updatedEmployee);
  }

  async remove(id: number): Promise<void> {
    this.logger.debug(`Removing employee by id: ${id}`, 'EmployeeService');
    const result = await this.employeeRepository.delete(id);
    this.logger.debug(`Result of removing employee: ${JSON.stringify(result)}`, 'EmployeeService');
    if (result.affected === 0) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
  }

  async buildHierarchy(managerId: number): Promise<any[]> {
    this.logger.debug(`Building hierarchy for managerId: ${managerId}`, 'EmployeeService');
    const employees = await this.employeeRepository.find({
      where: { managerId },
      relations: ['subordinates'],
    });
    this.logger.debug(`Found employees: ${JSON.stringify(employees)}`, 'EmployeeService');
    const hierarchy = await Promise.all(
      employees.map(async (employee) => {
        const children = await this.buildHierarchy(employee.id);
        return {
          id: employee.id,
          name: employee.name,
          positionId: employee.positionId,
          positionName: employee.positionName,
          child: children.length > 0 ? children : null,
        };
      }),
    );

    return hierarchy;
  }
}
