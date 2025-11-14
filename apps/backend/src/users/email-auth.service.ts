import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmailAuth, EmailAuthDocument } from './schemas/email-auth.schema';
import { CreateEmailAuthDto } from './dto/create-email-auth.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class EmailAuthService {
  constructor(
    @InjectModel(EmailAuth.name) private emailAuthModel: Model<EmailAuthDocument>,
  ) {}

  async findByEmail(email: string): Promise<EmailAuth | null> {
    return this.emailAuthModel.findOne({ email }).exec();
  }

  async findByUserId(userId: string): Promise<EmailAuth | null> {
    return this.emailAuthModel.findOne({ userId }).exec();
  }

  async findById(id: string): Promise<EmailAuthDocument | null> {
    return this.emailAuthModel.findById(id).exec();
  }

  async create(createEmailAuthDto: CreateEmailAuthDto): Promise<EmailAuth> {
    // Check if email already exists
    const existing = await this.findByEmail(createEmailAuthDto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createEmailAuthDto.password, 10);

    const emailAuth = new this.emailAuthModel({
      email: createEmailAuthDto.email,
      password: hashedPassword,
      name: createEmailAuthDto.name,
    });

    return emailAuth.save();
  }

  async validatePassword(email: string, password: string): Promise<EmailAuth | null> {
    const emailAuth = await this.findByEmail(email);
    if (!emailAuth) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, emailAuth.password);
    if (!isPasswordValid) {
      return null;
    }

    return emailAuth;
  }

  async linkToUser(emailAuthId: string, userId: string): Promise<EmailAuth> {
    const emailAuth = await this.emailAuthModel.findByIdAndUpdate(
      emailAuthId,
      { userId },
      { new: true }
    ).exec();
    
    if (!emailAuth) {
      throw new UnauthorizedException('EmailAuth not found');
    }

    return emailAuth;
  }

  async updatePassword(emailAuthId: string, newPassword: string): Promise<EmailAuth> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const emailAuth = await this.emailAuthModel.findByIdAndUpdate(
      emailAuthId,
      { password: hashedPassword },
      { new: true }
    ).exec();
    
    if (!emailAuth) {
      throw new UnauthorizedException('EmailAuth not found');
    }

    return emailAuth;
  }
}

