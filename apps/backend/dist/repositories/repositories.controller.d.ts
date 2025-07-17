import { RepositoriesService } from './repositories.service';
import { CreateRepositoryDto } from './dto/create-repository.dto';
export declare class RepositoriesController {
    private readonly repositoriesService;
    constructor(repositoriesService: RepositoriesService);
    create(createRepositoryDto: CreateRepositoryDto): Promise<import("./schemas/repository.schema").Repository>;
    findAll(installationId?: string): Promise<import("./schemas/repository.schema").Repository[]>;
    findOne(id: string): Promise<import("./schemas/repository.schema").Repository>;
    update(id: string, updateRepositoryDto: Partial<CreateRepositoryDto>): Promise<import("./schemas/repository.schema").Repository>;
    remove(id: string): Promise<import("./schemas/repository.schema").Repository>;
    syncRepositories(installationId: string, user: any): Promise<{
        message: string;
        installationId: string;
    }>;
}
