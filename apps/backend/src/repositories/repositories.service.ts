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
    const existingRepo = await this.findByRepositoryId(repositoryData.repositoryId);
    
    if (existingRepo) {
      return this.updateByRepositoryId(repositoryData.repositoryId, repositoryData);
    } else {
      return this.create(repositoryData);
    }
  }

  async remove(id: string): Promise<Repository> {
    return this.repositoryModel.findByIdAndDelete(id).exec();
  }

  async removeByInstallationId(installationId: string): Promise<void> {
    await this.repositoryModel.deleteMany({ installationId }).exec();
  }
} 