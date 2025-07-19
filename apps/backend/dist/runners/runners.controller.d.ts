import { RunnersService } from './runners.service';
import { CreateRunnerDto, RegisterRunnerDto, UpdateRunnerDto } from './dto/create-runner.dto';
import { Runner, RunnerStatus } from './schemas/runner.schema';
export declare class RunnersController {
    private readonly runnersService;
    constructor(runnersService: RunnersService);
    create(createRunnerDto: CreateRunnerDto, req: any): Promise<Runner>;
    register(registerRunnerDto: RegisterRunnerDto): Promise<Runner>;
    findAll(req: any): Promise<Runner[]>;
    getAvailableRunners(req: any): Promise<Runner[]>;
    findOne(id: string): Promise<Runner>;
    update(id: string, updateRunnerDto: UpdateRunnerDto): Promise<Runner>;
    remove(id: string): Promise<void>;
    updateStatus(runnerId: string, body: {
        status: RunnerStatus;
    }): Promise<Runner>;
    heartbeat(runnerId: string, body?: {
        systemInfo?: any;
    }): Promise<Runner>;
    assignJob(runnerId: string, jobData: {
        jobId: string;
        repository: string;
        workflow: string;
    }): Promise<Runner>;
    completeJob(runnerId: string, body: {
        jobId: string;
        status: string;
        duration?: number;
    }): Promise<Runner>;
    generateRegistrationToken(req: any): Promise<{
        registrationToken: string;
    }>;
}
