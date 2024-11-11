import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { CustomLogger } from '../logging/logger.service';
import { ConfigService } from '@nestjs/config';

describe('EmployeeController', () => {
  let controller: EmployeeController;
  let service: EmployeeService;

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
      controllers: [EmployeeController],
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

    controller = module.get<EmployeeController>(EmployeeController);
    service = module.get<EmployeeService>(EmployeeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getHierarchy', () => {
    it('should return employee hierarchy', async () => {
      const mockHierarchy = [
        {
          id: 2,
          name: 'Senior Engineer',
          positionId: 2,
          positionName: 'Senior Engineer',
          child: [],
        },
      ];

      jest.spyOn(service, 'buildHierarchy').mockResolvedValue(mockHierarchy);

      const result = await controller.getHierarchy('1');
      expect(result).toEqual(mockHierarchy);
      expect(service.buildHierarchy).toHaveBeenCalledWith(1);
    });
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

      jest.spyOn(service, 'create').mockResolvedValue(mockCreatedEmployee as Employee);

      const result = await controller.create(createEmployeeDto);
      expect(result).toEqual(mockCreatedEmployee);
      expect(service.create).toHaveBeenCalledWith(createEmployeeDto);
    });
  });
});
