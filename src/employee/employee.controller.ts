import { Controller, Get, Post, Body, Param, UseGuards, Patch, Delete, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('employees')
@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new employee' })
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  @Get('hierarchy/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get employee hierarchy' })
  getHierarchy(@Param('id') id: string) {
    return this.employeeService.buildHierarchy(+id);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all employees' })
  findAll() {
    return this.employeeService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get employee by id' })
  async findOne(@Param('id') id: string) {
    const employee = await this.employeeService.findOne(+id);
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    const hierarchy = await this.employeeService.buildHierarchy(+id);
    const { managerId, ...rest } = employee;
    return { ...rest, child: hierarchy };
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update employee by id' })
  update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeeService.update(+id, updateEmployeeDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete employee by id' })
  remove(@Param('id') id: string) {
    return this.employeeService.remove(+id);
  }
}
