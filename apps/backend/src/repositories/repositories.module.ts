import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RepositoriesService } from './repositories.service';
import { RepositoriesController } from './repositories.controller';
import { Repository, RepositorySchema } from './schemas/repository.schema';
import { GitHubModule } from '../github/github.module';
import { InstallationsModule } from '../installations/installations.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Repository.name, schema: RepositorySchema }]),
    GitHubModule,
    InstallationsModule,
    forwardRef(() => AuthModule), // Use forwardRef to handle circular dependency
  ],
  controllers: [RepositoriesController],
  providers: [RepositoriesService],
  exports: [RepositoriesService],
})
export class RepositoriesModule {} 