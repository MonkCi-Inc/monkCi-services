import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InstallationsService } from './installations.service';
import { InstallationsController } from './installations.controller';
import { Installation, InstallationSchema } from './schemas/installation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Installation.name, schema: InstallationSchema }]),
  ],
  controllers: [InstallationsController],
  providers: [InstallationsService],
  exports: [InstallationsService],
})
export class InstallationsModule {} 