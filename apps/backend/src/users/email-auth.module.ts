import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailAuthService } from './email-auth.service';
import { EmailAuth, EmailAuthSchema } from './schemas/email-auth.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: EmailAuth.name, schema: EmailAuthSchema }]),
  ],
  providers: [EmailAuthService],
  exports: [EmailAuthService],
})
export class EmailAuthModule {}

