import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployeeDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  positionId: number;

  @ApiProperty()
  @IsString()
  positionName: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  managerId?: number;
}