import { Model } from 'mongoose';
import { Installation, InstallationDocument } from './schemas/installation.schema';
import { CreateInstallationDto } from './dto/create-installation.dto';
export declare class InstallationsService {
    private installationModel;
    constructor(installationModel: Model<InstallationDocument>);
    create(createInstallationDto: CreateInstallationDto): Promise<Installation>;
    findAll(): Promise<Installation[]>;
    findOne(id: string): Promise<Installation>;
    findByInstallationId(installationId: number): Promise<Installation>;
    findByUserId(userId: string): Promise<Installation[]>;
    update(id: string, updateInstallationDto: Partial<CreateInstallationDto>): Promise<Installation>;
    updateByInstallationId(installationId: number, updateInstallationDto: Partial<CreateInstallationDto>): Promise<Installation>;
    remove(id: string): Promise<Installation>;
}
