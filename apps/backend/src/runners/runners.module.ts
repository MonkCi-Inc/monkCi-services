import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RunnersService } from './runners.service';
import { RunnersController } from './runners.controller';
import { Runner, RunnerSchema } from './schemas/runner.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Runner.name, schema: RunnerSchema }
    ])
  ],
  controllers: [RunnersController],
  providers: [RunnersService],
  exports: [RunnersService],
})
export class RunnersModule {} 