import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RepositoriesService } from './repositories.service';
import { RepositoriesController } from './repositories.controller';
import { Repository, RepositorySchema } from './schemas/repository.schema';
import { GitHubModule } from '../github/github.module';
import { InstallationsModule } from '../installations/installations.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Repository.name, schema: RepositorySchema }]),
    GitHubModule,
    InstallationsModule,
  ],
  controllers: [RepositoriesController],
  providers: [RepositoriesService],
  exports: [RepositoriesService],
})
export class RepositoriesModule {} 