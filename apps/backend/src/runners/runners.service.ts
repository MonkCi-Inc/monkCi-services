import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Runner, RunnerDocument, RunnerStatus } from './schemas/runner.schema';
import { CreateRunnerDto, RegisterRunnerDto, UpdateRunnerDto } from './dto/create-runner.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class RunnersService {
  constructor(
    @InjectModel(Runner.name) private runnerModel: Model<RunnerDocument>,
  ) {}

  async create(createRunnerDto: CreateRunnerDto, userId: string): Promise<Runner> {
    const runnerId = this.generateRunnerId();
    const registrationToken = this.generateRegistrationToken();
    
    const runner = new this.runnerModel({
      ...createRunnerDto,
      runnerId,
      userId: new Types.ObjectId(userId),
      registrationToken,
      status: RunnerStatus.OFFLINE,
      isActive: true,
    });

    return runner.save();
  }

  async registerRunner(registerRunnerDto: RegisterRunnerDto): Promise<Runner> {
    // Find runner by registration token
    const runner = await this.runnerModel.findOne({
      registrationToken: registerRunnerDto.registrationToken,
      isActive: true,
    });

    if (!runner) {
      throw new NotFoundException('Invalid registration token');
    }

    if (runner.status !== RunnerStatus.OFFLINE) {
      throw new BadRequestException('Runner is already registered');
    }

    // Update runner with registration data
    runner.name = registerRunnerDto.name;
    runner.description = registerRunnerDto.description;
    runner.architecture = registerRunnerDto.architecture;
    runner.operatingSystem = registerRunnerDto.operatingSystem;
    runner.labels = registerRunnerDto.labels || [];
    runner.capabilities = registerRunnerDto.capabilities || {};
    runner.environment = registerRunnerDto.environment || {};
    runner.version = registerRunnerDto.version;
    runner.systemInfo = registerRunnerDto.systemInfo || {};
    runner.status = RunnerStatus.IDLE;
    runner.lastSeenAt = new Date();
    runner.lastHeartbeatAt = new Date();

    // Generate access token for runner
    runner.accessToken = this.generateAccessToken();

    return runner.save();
  }

  async findAll(userId?: string): Promise<Runner[]> {
    const filter = userId ? { userId: new Types.ObjectId(userId) } : {};
    return this.runnerModel.find(filter).exec();
  }

  async findOne(id: string): Promise<Runner> {
    const runner = await this.runnerModel.findById(id).exec();
    if (!runner) {
      throw new NotFoundException('Runner not found');
    }
    return runner;
  }

  async findByRunnerId(runnerId: string): Promise<Runner> {
    const runner = await this.runnerModel.findOne({ runnerId }).exec();
    if (!runner) {
      throw new NotFoundException('Runner not found');
    }
    return runner;
  }

  async update(id: string, updateRunnerDto: UpdateRunnerDto): Promise<Runner> {
    const runner = await this.runnerModel.findByIdAndUpdate(
      id,
      { $set: updateRunnerDto },
      { new: true },
    ).exec();

    if (!runner) {
      throw new NotFoundException('Runner not found');
    }

    return runner;
  }

  async remove(id: string): Promise<void> {
    const result = await this.runnerModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Runner not found');
    }
  }

  async updateStatus(runnerId: string, status: RunnerStatus): Promise<Runner> {
    const runner = await this.runnerModel.findOneAndUpdate(
      { runnerId },
      { 
        $set: { 
          status,
          lastSeenAt: new Date(),
          lastHeartbeatAt: new Date(),
        }
      },
      { new: true },
    ).exec();

    if (!runner) {
      throw new NotFoundException('Runner not found');
    }

    return runner;
  }

  async heartbeat(runnerId: string, systemInfo?: any): Promise<Runner> {
    const updateData: any = {
      lastHeartbeatAt: new Date(),
      lastSeenAt: new Date(),
    };

    if (systemInfo) {
      updateData.systemInfo = systemInfo;
    }

    const runner = await this.runnerModel.findOneAndUpdate(
      { runnerId },
      { $set: updateData },
      { new: true },
    ).exec();

    if (!runner) {
      throw new NotFoundException('Runner not found');
    }

    return runner;
  }

  async assignJob(runnerId: string, jobData: {
    jobId: string;
    repository: string;
    workflow: string;
  }): Promise<Runner> {
    const runner = await this.runnerModel.findOneAndUpdate(
      { 
        runnerId,
        status: RunnerStatus.IDLE,
        isActive: true,
      },
      { 
        $set: { 
          status: RunnerStatus.BUSY,
          currentJob: {
            ...jobData,
            startedAt: new Date(),
          },
          lastSeenAt: new Date(),
        }
      },
      { new: true },
    ).exec();

    if (!runner) {
      throw new NotFoundException('Runner not available for job assignment');
    }

    return runner;
  }

  async completeJob(runnerId: string, jobId: string, status: string, duration?: number): Promise<Runner> {
    const runner = await this.runnerModel.findOne({ runnerId }).exec();
    if (!runner) {
      throw new NotFoundException('Runner not found');
    }

    if (!runner.currentJob || runner.currentJob.jobId !== jobId) {
      throw new BadRequestException('No matching job found for this runner');
    }

    // Add job to history
    const jobHistoryEntry = {
      ...runner.currentJob,
      status,
      completedAt: new Date(),
      duration,
    };

    // Update statistics
    const updateData: any = {
      status: RunnerStatus.IDLE,
      currentJob: null,
      lastSeenAt: new Date(),
      $push: { jobHistory: jobHistoryEntry },
      $inc: { totalJobsCompleted: 1 },
    };

    if (status === 'failed') {
      updateData.$inc.totalJobsFailed = 1;
    }

    if (duration) {
      updateData.$inc.totalRuntimeSeconds = duration;
    }

    const updatedRunner = await this.runnerModel.findByIdAndUpdate(
      runner._id,
      updateData,
      { new: true },
    ).exec();

    return updatedRunner;
  }

  async getAvailableRunners(labels?: string[]): Promise<Runner[]> {
    const filter: any = {
      status: RunnerStatus.IDLE,
      isActive: true,
    };

    if (labels && labels.length > 0) {
      filter.labels = { $in: labels };
    }

    return this.runnerModel.find(filter).exec();
  }

  async generateRegistrationTokenForUser(userId: string): Promise<string> {
    const token = this.generateRegistrationToken();
    
    // Create a temporary runner record for registration
    const runner = new this.runnerModel({
      runnerId: this.generateRunnerId(),
      userId: new Types.ObjectId(userId),
      registrationToken: token,
      status: RunnerStatus.OFFLINE,
      isActive: true,
      name: 'Pending Registration',
    });

    await runner.save();
    return token;
  }

  private generateRunnerId(): string {
    return `runner_${randomBytes(8).toString('hex')}`;
  }

  private generateRegistrationToken(): string {
    return `reg_${randomBytes(16).toString('hex')}`;
  }

  private generateAccessToken(): string {
    return `token_${randomBytes(24).toString('hex')}`;
  }
} 