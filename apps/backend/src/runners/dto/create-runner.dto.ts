import { IsString, IsOptional, IsEnum, IsArray, IsObject, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RunnerArchitecture, RunnerOperatingSystem } from '../schemas/runner.schema';

export class CreateRunnerDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: RunnerArchitecture })
  @IsEnum(RunnerArchitecture)
  architecture: RunnerArchitecture;

  @ApiProperty({ enum: RunnerOperatingSystem })
  @IsEnum(RunnerOperatingSystem)
  operatingSystem: RunnerOperatingSystem;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  labels?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  capabilities?: Record<string, any>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  environment?: Record<string, string>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  version?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  systemInfo?: {
    cpuCount?: number;
    memoryGB?: number;
    diskSpaceGB?: number;
    hostname?: string;
    ipAddress?: string;
  };
}

export class RegisterRunnerDto {
  @ApiProperty()
  @IsString()
  registrationToken: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: RunnerArchitecture })
  @IsEnum(RunnerArchitecture)
  architecture: RunnerArchitecture;

  @ApiProperty({ enum: RunnerOperatingSystem })
  @IsEnum(RunnerOperatingSystem)
  operatingSystem: RunnerOperatingSystem;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  labels?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  capabilities?: Record<string, any>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  environment?: Record<string, string>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  version?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  systemInfo?: {
    cpuCount?: number;
    memoryGB?: number;
    diskSpaceGB?: number;
    hostname?: string;
    ipAddress?: string;
  };
}

export class UpdateRunnerDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  labels?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  capabilities?: Record<string, any>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  environment?: Record<string, string>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
} 