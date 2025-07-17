import { IsNumber, IsString, IsBoolean, IsOptional, IsArray, IsDateString, IsMongoId } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRepositoryDto {
  @ApiProperty()
  @IsNumber()
  repositoryId: number;

  @ApiProperty()
  @IsMongoId()
  installationId: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  fullName: string;

  @ApiProperty()
  @IsBoolean()
  private: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsString()
  defaultBranch: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  topics?: string[];

  @ApiProperty()
  @IsBoolean()
  archived: boolean;

  @ApiProperty()
  @IsBoolean()
  disabled: boolean;

  @ApiProperty()
  @IsBoolean()
  fork: boolean;

  @ApiProperty()
  @IsNumber()
  size: number;

  @ApiProperty()
  @IsNumber()
  stargazersCount: number;

  @ApiProperty()
  @IsNumber()
  watchersCount: number;

  @ApiProperty()
  @IsNumber()
  forksCount: number;

  @ApiProperty()
  @IsNumber()
  openIssuesCount: number;

  @ApiProperty()
  @IsDateString()
  createdAt: string;

  @ApiProperty()
  @IsDateString()
  updatedAt: string;

  @ApiProperty()
  @IsDateString()
  pushedAt: string;
} 