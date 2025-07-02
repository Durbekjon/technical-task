import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ example: 'Task title' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Task description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '2024-06-01T00:00:00Z', required: false })
  @IsOptional()
  @IsDateString()
  dueDate?: string;
}
