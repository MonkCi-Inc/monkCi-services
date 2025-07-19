import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RunnersService } from './runners.service';
import { CreateRunnerDto, RegisterRunnerDto, UpdateRunnerDto } from './dto/create-runner.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Runner, RunnerStatus } from './schemas/runner.schema';

@ApiTags('runners')
@Controller('runners')
export class RunnersController {
  constructor(private readonly runnersService: RunnersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new runner' })
  @ApiResponse({ status: 201, description: 'Runner created successfully' })
  async create(@Body() createRunnerDto: CreateRunnerDto, @Request() req) {
    return this.runnersService.create(createRunnerDto, req.user.userId);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a runner with a registration token' })
  @ApiResponse({ status: 201, description: 'Runner registered successfully' })
  async register(@Body() registerRunnerDto: RegisterRunnerDto) {
    return this.runnersService.registerRunner(registerRunnerDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all runners for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Runners retrieved successfully' })
  async findAll(@Request() req) {
    return this.runnersService.findAll(req.user.userId);
  }

  @Get('available')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get available runners for job assignment' })
  @ApiResponse({ status: 200, description: 'Available runners retrieved successfully' })
  async getAvailableRunners(@Request() req) {
    // You can add query parameters for labels filtering
    return this.runnersService.getAvailableRunners();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a specific runner by ID' })
  @ApiResponse({ status: 200, description: 'Runner retrieved successfully' })
  async findOne(@Param('id') id: string) {
    return this.runnersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a runner' })
  @ApiResponse({ status: 200, description: 'Runner updated successfully' })
  async update(@Param('id') id: string, @Body() updateRunnerDto: UpdateRunnerDto) {
    return this.runnersService.update(id, updateRunnerDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a runner' })
  @ApiResponse({ status: 200, description: 'Runner deleted successfully' })
  async remove(@Param('id') id: string) {
    return this.runnersService.remove(id);
  }

  // Runner status and heartbeat endpoints
  @Post(':runnerId/status')
  @ApiOperation({ summary: 'Update runner status' })
  @ApiResponse({ status: 200, description: 'Runner status updated successfully' })
  async updateStatus(
    @Param('runnerId') runnerId: string,
    @Body() body: { status: RunnerStatus }
  ) {
    return this.runnersService.updateStatus(runnerId, body.status);
  }

  @Post(':runnerId/heartbeat')
  @ApiOperation({ summary: 'Send heartbeat from runner' })
  @ApiResponse({ status: 200, description: 'Heartbeat received successfully' })
  async heartbeat(
    @Param('runnerId') runnerId: string,
    @Body() body?: { systemInfo?: any }
  ) {
    return this.runnersService.heartbeat(runnerId, body?.systemInfo);
  }

  // Job management endpoints
  @Post(':runnerId/assign-job')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Assign a job to a runner' })
  @ApiResponse({ status: 200, description: 'Job assigned successfully' })
  async assignJob(
    @Param('runnerId') runnerId: string,
    @Body() jobData: {
      jobId: string;
      repository: string;
      workflow: string;
    }
  ) {
    return this.runnersService.assignJob(runnerId, jobData);
  }

  @Post(':runnerId/complete-job')
  @ApiOperation({ summary: 'Mark a job as completed' })
  @ApiResponse({ status: 200, description: 'Job completed successfully' })
  async completeJob(
    @Param('runnerId') runnerId: string,
    @Body() body: {
      jobId: string;
      status: string;
      duration?: number;
    }
  ) {
    return this.runnersService.completeJob(
      runnerId,
      body.jobId,
      body.status,
      body.duration
    );
  }

  // Registration token generation
  @Post('generate-token')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate a registration token for a new runner' })
  @ApiResponse({ status: 201, description: 'Registration token generated successfully' })
  async generateRegistrationToken(@Request() req) {
    const token = await this.runnersService.generateRegistrationTokenForUser(req.user.userId);
    return { registrationToken: token };
  }
} 