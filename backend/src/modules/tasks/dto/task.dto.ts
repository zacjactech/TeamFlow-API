import { IsNotEmpty, IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { TaskStatus } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ example: 'Implement login' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'Use JWT for authentication' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'uuid-of-user' })
  @IsUUID()
  @IsOptional()
  assigned_to?: string;
}

export class UpdateTaskDto {
  @ApiPropertyOptional({ example: 'Implement login' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: 'Use JWT for authentication' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ enum: TaskStatus })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiPropertyOptional({ example: 'uuid-of-user' })
  @IsUUID()
  @IsOptional()
  assigned_to?: string;
}
