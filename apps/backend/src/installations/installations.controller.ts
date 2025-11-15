import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InstallationsService } from './installations.service';
import { CreateInstallationDto } from './dto/create-installation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthService } from '../auth/auth.service';

@ApiTags('installations')
@Controller('installations')
export class InstallationsController {
  constructor(
    private readonly installationsService: InstallationsService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new installation' })
  @ApiResponse({ status: 201, description: 'Installation created successfully.' })
  create(@Body() createInstallationDto: CreateInstallationDto) {
    return this.installationsService.create(createInstallationDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all installations for current user from GitHub API' })
  @ApiResponse({ status: 200, description: 'Return all installations from GitHub.' })
  async findAll(@CurrentUser() user: any) {
    if (!user.userId) {
      throw new Error('User ID not found in token. Please ensure you are logged in with GitHub.');
    }
    // Fetch directly from GitHub API (no database)
    const installations = await this.authService.getUserInstallations(user.userId);
    return installations;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get an installation by GitHub installation ID' })
  @ApiResponse({ status: 200, description: 'Return the installation from GitHub API.' })
  async findOne(@CurrentUser() user: any, @Param('id') id: string) {
    if (!user.userId) {
      throw new Error('User ID not found in token. Please ensure you are logged in with GitHub.');
    }
    // ID is now a GitHub installation ID (number), not MongoDB ObjectId
    const installationId = parseInt(id);
    if (isNaN(installationId)) {
      throw new Error('Invalid installation ID. Must be a GitHub installation ID (number).');
    }
    // Fetch directly from GitHub API (no database)
    return this.authService.getUserInstallationById(user.userId, installationId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an installation' })
  @ApiResponse({ status: 200, description: 'Installation updated successfully.' })
  update(@Param('id') id: string, @Body() updateInstallationDto: Partial<CreateInstallationDto>) {
    return this.installationsService.update(id, updateInstallationDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an installation' })
  @ApiResponse({ status: 200, description: 'Installation deleted successfully.' })
  remove(@Param('id') id: string) {
    return this.installationsService.remove(id);
  }
} 