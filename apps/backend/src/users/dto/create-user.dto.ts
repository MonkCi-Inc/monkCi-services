import { IsNumber, IsString, IsOptional, IsBoolean, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsNumber()
  githubId: number;

  @ApiProperty()
  @IsString()
  login: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiProperty()
  @IsString()
  accessToken: string;

  // Additional GitHub user data
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nodeId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  gravatarId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  url?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  htmlUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  followersUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  followingUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  gistsUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  starredUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  subscriptionsUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  organizationsUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reposUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  eventsUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  receivedEventsUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  userViewType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  siteAdmin?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  company?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  blog?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  hireable?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  twitterUsername?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notificationEmail?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  publicRepos?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  publicGists?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  followers?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  following?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  createdAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  updatedAt?: string;
} 