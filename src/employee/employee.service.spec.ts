import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeeService } from './employee.service';
import { Employee } from './entities/employee.entity';
import { CustomLogger } from '../logging/logger.service';
import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let repository: Repository<Employee>;

  const mockEmployeeRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeService,
        {
          provide: getRepositoryToken(Employee),
          useValue: mockEmployeeRepository,
        },
        {
          provide: CustomLogger,
          useValue: mockLogger,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<EmployeeService>(EmployeeService);
    repository = module.get<Repository<Employee>>(getRepositoryToken(Employee));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an employee', async () => {
      const createEmployeeDto = {
        name: 'John Doe',
        positionId: 1,
        positionName: 'Developer',
        managerId: null,
      };

      const mockCreatedEmployee = {
        id: 1,
        ...createEmployeeDto,
      };

      mockEmployeeRepository.create.mockReturnValue(createEmployeeDto);
      mockEmployeeRepository.save.mockResolvedValue(mockCreatedEmployee);

      const result = await service.create(createEmployeeDto);
      expect(result).toEqual(mockCreatedEmployee);
      expect(mockEmployeeRepository.create).toHaveBeenCalledWith(createEmployeeDto);
      expect(mockEmployeeRepository.save).toHaveBeenCalled();
    });
  });

  describe('buildHierarchy', () => {
    it('should return employee hierarchy', async () => {
      const mockEmployees = [
        {
          id: 2,
          name: 'Senior Engineer',
          positionId: 2,
          positionName: 'Senior Engineer',
          managerId: 1,
        },
      ];

      mockEmployeeRepository.find.mockResolvedValue(mockEmployees);
      mockEmployeeRepository.findOne.mockResolvedValue({
        id: 1,
        name: 'CTO',
        positionId: 1,
        positionName: 'CTO',
      });

      const result = await service.buildHierarchy(1);
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBeTruthy();
    });

    it('should throw NotFoundException when manager not found', async () => {
      mockEmployeeRepository.find.mockResolvedValue([]);
      mockEmployeeRepository.findOne.mockResolvedValue(null);

      await expect(service.buildHierarchy(999)).rejects.toThrow(NotFoundException);
    });
  });
});