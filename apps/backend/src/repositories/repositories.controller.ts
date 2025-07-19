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

@ApiTags('repositories')
@Controller('repositories')
export class RepositoriesController {
  constructor(
    private readonly repositoriesService: RepositoriesService,
    private readonly githubService: GitHubService,
    private readonly installationsService: InstallationsService,
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
  async getRepositoryRunners(@Param('id') id: string) {
    const repository = await this.repositoriesService.findOne(id);
    
    if (!repository.installationId) {
      return { runners: [], message: 'Repository not associated with an installation' };
    }

    // The installation is already populated, so we can use it directly
    const installation = repository.installationId as any;
    
    // Extract owner and repo from fullName
    const [owner, repo] = repository.fullName.split('/');
    
    try {
      const runners = await this.githubService.getRepositoryRunners(
        installation.installationId,
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
  async getRepositoryWorkflows(@Param('id') id: string) {
    const repository = await this.repositoriesService.findOne(id);
    
    if (!repository.installationId) {
      return { workflows: [], message: 'Repository not associated with an installation' };
    }

    // The installation is already populated, so we can use it directly
    const installation = repository.installationId as any;
    
    // Extract owner and repo from fullName
    const [owner, repo] = repository.fullName.split('/');
    
    try {
      const workflows = await this.githubService.getRepositoryWorkflows(
        installation.installationId,
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
  async getWorkflowRuns(@Param('id') id: string, @Param('workflowId') workflowId: string) {
    const repository = await this.repositoriesService.findOne(id);
    
    if (!repository.installationId) {
      return { runs: [], message: 'Repository not associated with an installation' };
    }

    // The installation is already populated, so we can use it directly
    const installation = repository.installationId as any;
    
    // Extract owner and repo from fullName
    const [owner, repo] = repository.fullName.split('/');
    
    try {
      const runs = await this.githubService.getWorkflowRuns(
        installation.installationId,
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
  async getWorkflowRunLogs(@Param('id') id: string, @Param('runId') runId: string) {
    const repository = await this.repositoriesService.findOne(id);
    
    if (!repository.installationId) {
      return { logs: null, message: 'Repository not associated with an installation' };
    }

    // The installation is already populated, so we can use it directly
    const installation = repository.installationId as any;
    
    // Extract owner and repo from fullName
    const [owner, repo] = repository.fullName.split('/');
    
    try {
      const logs = await this.githubService.getWorkflowRunLogs(
        installation.installationId,
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