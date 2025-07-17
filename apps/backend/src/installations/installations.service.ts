import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Installation, InstallationDocument } from './schemas/installation.schema';
import { CreateInstallationDto } from './dto/create-installation.dto';

@Injectable()
export class InstallationsService {
  constructor(
    @InjectModel(Installation.name) private installationModel: Model<InstallationDocument>,
  ) {}

  async create(createInstallationDto: CreateInstallationDto): Promise<Installation> {
    const createdInstallation = new this.installationModel(createInstallationDto);
    return createdInstallation.save();
  }

  async findAll(): Promise<Installation[]> {
    return this.installationModel.find().populate('userId').exec();
  }

  async findOne(id: string): Promise<Installation> {
    return this.installationModel.findById(id).populate('userId').exec();
  }

  async findByInstallationId(installationId: number): Promise<Installation> {
    return this.installationModel.findOne({ installationId }).populate('userId').exec();
  }

  async findByUserId(userId: string): Promise<Installation[]> {
    return this.installationModel.find({ userId }).populate('userId').exec();
  }

  async update(id: string, updateInstallationDto: Partial<CreateInstallationDto>): Promise<Installation> {
    return this.installationModel
      .findByIdAndUpdate(id, updateInstallationDto, { new: true })
      .populate('userId')
      .exec();
  }

  async updateByInstallationId(installationId: number, updateInstallationDto: Partial<CreateInstallationDto>): Promise<Installation> {
    return this.installationModel
      .findOneAndUpdate({ installationId }, updateInstallationDto, { new: true })
      .populate('userId')
      .exec();
  }

  async remove(id: string): Promise<Installation> {
    return this.installationModel.findByIdAndDelete(id).exec();
  }
} 