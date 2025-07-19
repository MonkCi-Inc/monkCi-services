import { Model } from 'mongoose';
import { Runner, RunnerDocument, RunnerStatus } from './schemas/runner.schema';
import { CreateRunnerDto, RegisterRunnerDto, UpdateRunnerDto } from './dto/create-runner.dto';
export declare class RunnersService {
    private runnerModel;
    constructor(runnerModel: Model<RunnerDocument>);
    create(createRunnerDto: CreateRunnerDto, userId: string): Promise<Runner>;
    registerRunner(registerRunnerDto: RegisterRunnerDto): Promise<Runner>;
    findAll(userId?: string): Promise<Runner[]>;
    findOne(id: string): Promise<Runner>;
    findByRunnerId(runnerId: string): Promise<Runner>;
    update(id: string, updateRunnerDto: UpdateRunnerDto): Promise<Runner>;
    remove(id: string): Promise<void>;
    updateStatus(runnerId: string, status: RunnerStatus): Promise<Runner>;
    heartbeat(runnerId: string, systemInfo?: any): Promise<Runner>;
    assignJob(runnerId: string, jobData: {
        jobId: string;
        repository: string;
        workflow: string;
    }): Promise<Runner>;
    completeJob(runnerId: string, jobId: string, status: string, duration?: number): Promise<Runner>;
    getAvailableRunners(labels?: string[]): Promise<Runner[]>;
    generateRegistrationTokenForUser(userId: string): Promise<string>;
    private generateRunnerId;
    private generateRegistrationToken;
    private generateAccessToken;
}
