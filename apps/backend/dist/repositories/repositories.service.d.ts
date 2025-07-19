import { Model } from 'mongoose';
import { Repository, RepositoryDocument } from './schemas/repository.schema';
import { CreateRepositoryDto } from './dto/create-repository.dto';
export declare class RepositoriesService {
    private repositoryModel;
    constructor(repositoryModel: Model<RepositoryDocument>);
    create(createRepositoryDto: CreateRepositoryDto): Promise<Repository>;
    findAll(): Promise<Repository[]>;
    findOne(id: string): Promise<Repository>;
    findByRepositoryId(repositoryId: number): Promise<Repository>;
    findByInstallationId(installationId: string): Promise<Repository[]>;
    update(id: string, updateRepositoryDto: Partial<CreateRepositoryDto>): Promise<Repository>;
    updateByRepositoryId(repositoryId: number, updateRepositoryDto: Partial<CreateRepositoryDto>): Promise<Repository>;
    upsertRepository(repositoryData: CreateRepositoryDto): Promise<Repository>;
    remove(id: string): Promise<Repository>;
    removeByInstallationId(installationId: string): Promise<void>;
    getRepositoryCount(): Promise<number>;
    syncRepositoriesForInstallation(installationId: string): Promise<any>;
    getInstallation(installationId: string): Promise<any>;
    syncAllRepositoriesForUser(userId: string): Promise<any>;
}
