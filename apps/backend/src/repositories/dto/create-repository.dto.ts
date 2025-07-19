import { IsNumber, IsString, IsBoolean, IsOptional, IsArray, IsDateString, IsMongoId, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRepositoryDto {
  @ApiProperty()
  @IsNumber()
  repositoryId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  installationId?: string;

  @ApiProperty()
  @IsMongoId()
  userId: string;

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

  // Additional GitHub repository data
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nodeId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  htmlUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  url?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  gitUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sshUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cloneUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  svnUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  homepage?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  hasIssues?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  hasProjects?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  hasDownloads?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  hasWiki?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  hasPages?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  hasDiscussions?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mirrorUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  allowForking?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isTemplate?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  webCommitSignoffRequired?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  visibility?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  license?: Record<string, any>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  permissions?: Record<string, any>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  owner?: Record<string, any>;
} 