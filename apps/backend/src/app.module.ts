import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { InstallationsModule } from './installations/installations.module';
import { RepositoriesModule } from './repositories/repositories.module';
import { PipelinesModule } from './pipelines/pipelines.module';
import { JobsModule } from './jobs/jobs.module';
import { RunnersModule } from './runners/runners.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/monkci'),
    AuthModule,
    UsersModule,
    InstallationsModule,
    RepositoriesModule,
    PipelinesModule,
    JobsModule,
    RunnersModule,
  ],
})
export class AppModule {} 