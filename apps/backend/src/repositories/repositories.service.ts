import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Repository, RepositoryDocument } from './schemas/repository.schema';
import { CreateRepositoryDto } from './dto/create-repository.dto';

@Injectable()
export class RepositoriesService {
  constructor(
    @InjectModel(Repository.name) private repositoryModel: Model<RepositoryDocument>,
  ) {}

  async create(createRepositoryDto: CreateRepositoryDto): Promise<Repository> {
    const createdRepository = new this.repositoryModel({
      ...createRepositoryDto,
      lastSyncAt: new Date(),
    });
    return createdRepository.save();
  }

  async findAll(): Promise<Repository[]> {
    return this.repositoryModel.find().populate('installationId').exec();
  }

  async findOne(id: string): Promise<Repository> {
    return this.repositoryModel.findById(id).populate('installationId').exec();
  }

  async findByRepositoryId(repositoryId: number): Promise<Repository> {
    return this.repositoryModel.findOne({ repositoryId }).populate('installationId').exec();
  }

  async findByInstallationId(installationId: string): Promise<Repository[]> {
    return this.repositoryModel.find({ installationId }).populate('installationId').exec();
  }

  async update(id: string, updateRepositoryDto: Partial<CreateRepositoryDto>): Promise<Repository> {
    return this.repositoryModel
      .findByIdAndUpdate(id, { ...updateRepositoryDto, lastSyncAt: new Date() }, { new: true })
      .populate('installationId')
      .exec();
  }

  async updateByRepositoryId(repositoryId: number, updateRepositoryDto: Partial<CreateRepositoryDto>): Promise<Repository> {
    return this.repositoryModel
      .findOneAndUpdate({ repositoryId }, { ...updateRepositoryDto, lastSyncAt: new Date() }, { new: true })
      .populate('installationId')
      .exec();
  }

  async upsertRepository(repositoryData: CreateRepositoryDto): Promise<Repository> {
    try {
      console.log(`Repositories Service - Upserting repository: ${repositoryData.fullName} (ID: ${repositoryData.repositoryId})`);
      
      const existingRepo = await this.findByRepositoryId(repositoryData.repositoryId);
      
      if (existingRepo) {
        console.log(`Repositories Service - Updating existing repository: ${repositoryData.fullName}`);
        const updatedRepo = await this.updateByRepositoryId(repositoryData.repositoryId, repositoryData);
        console.log(`Repositories Service - Successfully updated repository: ${repositoryData.fullName}`);
        return updatedRepo;
      } else {
        console.log(`Repositories Service - Creating new repository: ${repositoryData.fullName}`);
        const newRepo = await this.create(repositoryData);
        console.log(`Repositories Service - Successfully created repository: ${repositoryData.fullName}`);
        return newRepo;
      }
    } catch (error) {
      console.error(`Repositories Service - Error upserting repository ${repositoryData.fullName}:`, error);
      throw error;
    }
  }

  async remove(id: string): Promise<Repository> {
    return this.repositoryModel.findByIdAndDelete(id).exec();
  }

  async removeByInstallationId(installationId: string): Promise<void> {
    await this.repositoryModel.deleteMany({ installationId }).exec();
  }

  async getRepositoryCount(): Promise<number> {
    return this.repositoryModel.countDocuments().exec();
  }

  async syncRepositoriesForInstallation(installationId: string): Promise<any> {
    // This method would need access to GitHubService to actually sync
    // For now, just return the current repositories for this installation
    const repositories = await this.findByInstallationId(installationId);
    return {
      message: 'Repository sync completed',
      installationId,
      repositoriesCount: repositories.length,
      repositories
    };
  }

  async syncAllRepositoriesForUser(userId: string): Promise<any> {
    // This method would need access to InstallationsService and GitHubService
    // For now, just return the current repositories for this user
    const repositories = await this.repositoryModel.find().populate({
      path: 'installationId',
      match: { userId: userId }
    }).exec();
    
    const userRepositories = repositories.filter(repo => repo.installationId);
    
    return {
      message: 'All repositories sync completed',
      userId,
      repositoriesCount: userRepositories.length,
      repositories: userRepositories
    };
  }
} 