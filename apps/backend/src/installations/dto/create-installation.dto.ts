import { IsNumber, IsString, IsEnum, IsObject, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInstallationDto {
  @ApiProperty()
  @IsNumber()
  installationId: number;

  @ApiProperty()
  @IsMongoId()
  userId: string;

  @ApiProperty()
  @IsString()
  accountLogin: string;

  @ApiProperty({ enum: ['User', 'Organization'] })
  @IsEnum(['User', 'Organization'])
  accountType: 'User' | 'Organization';

  @ApiProperty()
  @IsObject()
  permissions: Record<string, string>;

  @ApiProperty({ enum: ['all', 'selected'] })
  @IsEnum(['all', 'selected'])
  repositorySelection: 'all' | 'selected';
} 