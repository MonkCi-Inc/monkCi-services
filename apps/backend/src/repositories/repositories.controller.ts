import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RepositoriesService } from './repositories.service';
import { CreateRepositoryDto } from './dto/create-repository.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthService } from '../auth/auth.service';

@ApiTags('repositories')
@Controller('repositories')
export class RepositoriesController {
  constructor(
    private readonly repositoriesService: RepositoriesService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new repository' })
  @ApiResponse({ status: 201, description: 'Repository created successfully.' })
  create(@Body() createRepositoryDto: CreateRepositoryDto) {
    return this.repositoriesService.create(createRepositoryDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all repositories' })
  @ApiQuery({ name: 'installationId', required: false, description: 'Filter by installation ID' })
  @ApiResponse({ status: 200, description: 'Return all repositories.' })
  findAll(@Query('installationId') installationId?: string) {
    if (installationId) {
      return this.repositoriesService.findByInstallationId(installationId);
    }
    return this.repositoriesService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a repository by id' })
  @ApiResponse({ status: 200, description: 'Return the repository.' })
  findOne(@Param('id') id: string) {
    return this.repositoriesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a repository' })
  @ApiResponse({ status: 200, description: 'Repository updated successfully.' })
  update(@Param('id') id: string, @Body() updateRepositoryDto: Partial<CreateRepositoryDto>) {
    return this.repositoriesService.update(id, updateRepositoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a repository' })
  @ApiResponse({ status: 200, description: 'Repository deleted successfully.' })
  remove(@Param('id') id: string) {
    return this.repositoriesService.remove(id);
  }

  @Post('sync/:installationId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sync repositories for an installation' })
  @ApiResponse({ status: 200, description: 'Repositories synced successfully.' })
  async syncRepositories(
    @Param('installationId') installationId: string,
    @CurrentUser() user: any,
  ) {
    // This endpoint will trigger a manual sync of repositories for the given installation
    // The actual sync logic is handled in the AuthService
    return { message: 'Repository sync initiated', installationId };
  }
} 