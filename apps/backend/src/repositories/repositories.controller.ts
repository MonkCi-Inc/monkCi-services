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
import { GitHubService } from '../github/github.service';
import { InstallationsService } from '../installations/installations.service';
import { AuthService } from '../auth/auth.service';

@ApiTags('repositories')
@Controller('repositories')
export class RepositoriesController {
  constructor(
    private readonly repositoriesService: RepositoriesService,
    private readonly githubService: GitHubService,
    private readonly installationsService: InstallationsService,
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
  @ApiOperation({ summary: 'Get all repositories from GitHub API' })
  @ApiQuery({ name: 'installationId', required: false, description: 'Filter by installation ID' })
  @ApiResponse({ status: 200, description: 'Return all repositories from GitHub.' })
  async findAll(@CurrentUser() user: any, @Query('installationId') installationId?: string) {
    if (!user.userId) {
      throw new Error('User ID not found in token. Please ensure you are logged in with GitHub.');
    }
    // Fetch directly from GitHub API (no database)
    const installationIdNum = installationId ? parseInt(installationId) : undefined;
    return this.authService.getUserRepositories(user.userId, installationIdNum);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a repository by GitHub repository ID' })
  @ApiResponse({ status: 200, description: 'Return the repository from GitHub API.' })
  async findOne(@CurrentUser() user: any, @Param('id') id: string) {
    if (!user.userId) {
      throw new Error('User ID not found in token. Please ensure you are logged in with GitHub.');
    }
    // ID is now a GitHub repository ID (number), not MongoDB ObjectId
    const repositoryId = parseInt(id);
    if (isNaN(repositoryId)) {
      throw new Error('Invalid repository ID. Must be a GitHub repository ID (number).');
    }
    // Fetch directly from GitHub API (no database)
    return this.authService.getUserRepositoryById(user.userId, repositoryId);
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
  @ApiOperation({ summary: 'Sync repositories for installation' })
  @ApiResponse({ status: 200, description: 'Repositories synced successfully.' })
  async syncRepositories(@Param('installationId') installationId: string) {
    return this.repositoriesService.syncRepositoriesForInstallation(installationId);
  }

  @Get('debug/count')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get repository count for debugging' })
  async getRepositoryCount() {
    const count = await this.repositoriesService.getRepositoryCount();
    return { count };
  }

  @Post('sync/all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sync repositories for all installations' })
  @ApiResponse({ status: 200, description: 'All repositories synced successfully.' })
  async syncAllRepositories(@CurrentUser() user: any) {
    return this.repositoriesService.syncAllRepositoriesForUser(user.userId);
  }

  @Get(':id/runners')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get GitHub Actions runners for a repository' })
  @ApiResponse({ status: 200, description: 'Return the repository runners.' })
  async getRepositoryRunners(@CurrentUser() user: any, @Param('id') id: string) {
    if (!user.userId) {
      throw new Error('User ID not found in token. Please ensure you are logged in with GitHub.');
    }
    // ID is now a GitHub repository ID (number), not MongoDB ObjectId
    const repositoryId = parseInt(id);
    if (isNaN(repositoryId)) {
      throw new Error('Invalid repository ID. Must be a GitHub repository ID (number).');
    }
    
    // Fetch repository from GitHub API
    const repository = await this.authService.getUserRepositoryById(user.userId, repositoryId);
    
    if (!repository.installationId) {
      return { runners: [], message: 'Repository not associated with an installation' };
    }
    
    // Extract owner and repo from fullName
    const [owner, repo] = repository.fullName.split('/');
    
    try {
      const runners = await this.githubService.getRepositoryRunners(
        repository.installationId,
        owner,
        repo
      );
      return { runners };
    } catch (error) {
      console.error('Error fetching repository runners:', error);
      return { runners: [], error: error.message };
    }
  }

  @Get(':id/workflows')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get GitHub Actions workflows for a repository' })
  @ApiResponse({ status: 200, description: 'Return the repository workflows.' })
  async getRepositoryWorkflows(@CurrentUser() user: any, @Param('id') id: string) {
    if (!user.userId) {
      throw new Error('User ID not found in token. Please ensure you are logged in with GitHub.');
    }
    // ID is now a GitHub repository ID (number), not MongoDB ObjectId
    const repositoryId = parseInt(id);
    if (isNaN(repositoryId)) {
      throw new Error('Invalid repository ID. Must be a GitHub repository ID (number).');
    }
    
    // Fetch repository from GitHub API
    const repository = await this.authService.getUserRepositoryById(user.userId, repositoryId);
    
    if (!repository.installationId) {
      return { workflows: [], message: 'Repository not associated with an installation' };
    }
    
    // Extract owner and repo from fullName
    const [owner, repo] = repository.fullName.split('/');
    
    try {
      const workflows = await this.githubService.getRepositoryWorkflows(
        repository.installationId,
        owner,
        repo
      );
      return { workflows };
    } catch (error) {
      console.error('Error fetching repository workflows:', error);
      return { workflows: [], error: error.message };
    }
  }

  @Get(':id/workflows/:workflowId/runs')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get GitHub Actions workflow runs for a specific workflow' })
  @ApiResponse({ status: 200, description: 'Return the workflow runs.' })
  async getWorkflowRuns(@CurrentUser() user: any, @Param('id') id: string, @Param('workflowId') workflowId: string) {
    if (!user.userId) {
      throw new Error('User ID not found in token. Please ensure you are logged in with GitHub.');
    }
    // ID is now a GitHub repository ID (number), not MongoDB ObjectId
    const repositoryId = parseInt(id);
    if (isNaN(repositoryId)) {
      throw new Error('Invalid repository ID. Must be a GitHub repository ID (number).');
    }
    
    // Fetch repository from GitHub API
    const repository = await this.authService.getUserRepositoryById(user.userId, repositoryId);
    
    if (!repository.installationId) {
      return { runs: [], message: 'Repository not associated with an installation' };
    }
    
    // Extract owner and repo from fullName
    const [owner, repo] = repository.fullName.split('/');
    
    try {
      const runs = await this.githubService.getWorkflowRuns(
        repository.installationId,
        owner,
        repo,
        parseInt(workflowId)
      );
      return { runs };
    } catch (error) {
      console.error('Error fetching workflow runs:', error);
      return { runs: [], error: error.message };
    }
  }

  @Get(':id/runs/:runId/logs')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get GitHub Actions workflow run logs for a specific run' })
  @ApiResponse({ status: 200, description: 'Return the workflow run logs.' })
  async getWorkflowRunLogs(@CurrentUser() user: any, @Param('id') id: string, @Param('runId') runId: string) {
    if (!user.userId) {
      throw new Error('User ID not found in token. Please ensure you are logged in with GitHub.');
    }
    // ID is now a GitHub repository ID (number), not MongoDB ObjectId
    const repositoryId = parseInt(id);
    if (isNaN(repositoryId)) {
      throw new Error('Invalid repository ID. Must be a GitHub repository ID (number).');
    }
    
    // Fetch repository from GitHub API
    const repository = await this.authService.getUserRepositoryById(user.userId, repositoryId);
    
    if (!repository.installationId) {
      return { logs: null, message: 'Repository not associated with an installation' };
    }
    
    // Extract owner and repo from fullName
    const [owner, repo] = repository.fullName.split('/');
    
    try {
      const logs = await this.githubService.getWorkflowRunLogs(
        repository.installationId,
        owner,
        repo,
        parseInt(runId)
      );
      return { logs };
    } catch (error) {
      console.error('Error fetching workflow run logs:', error);
      return { logs: null, error: error.message };
    }
  }
} 