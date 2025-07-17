import { InstallationsService } from './installations.service';
import { CreateInstallationDto } from './dto/create-installation.dto';
export declare class InstallationsController {
    private readonly installationsService;
    constructor(installationsService: InstallationsService);
    create(createInstallationDto: CreateInstallationDto): Promise<import("./schemas/installation.schema").Installation>;
    findAll(user: any): Promise<import("./schemas/installation.schema").Installation[]>;
    findOne(id: string): Promise<import("./schemas/installation.schema").Installation>;
    update(id: string, updateInstallationDto: Partial<CreateInstallationDto>): Promise<import("./schemas/installation.schema").Installation>;
    remove(id: string): Promise<import("./schemas/installation.schema").Installation>;
}
