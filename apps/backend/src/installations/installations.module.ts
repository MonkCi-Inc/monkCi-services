import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InstallationsService } from './installations.service';
import { InstallationsController } from './installations.controller';
import { Installation, InstallationSchema } from './schemas/installation.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Installation.name, schema: InstallationSchema }]),
    forwardRef(() => AuthModule), // Use forwardRef to handle circular dependency
  ],
  controllers: [InstallationsController],
  providers: [InstallationsService],
  exports: [InstallationsService],
})
export class InstallationsModule {} 