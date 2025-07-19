import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { InstallationsModule } from '../installations/installations.module';
import { RepositoriesModule } from '../repositories/repositories.module';
import { GitHubModule } from '../github/github.module';

@Module({
  imports: [
    UsersModule,
    InstallationsModule,
    RepositoriesModule,
    GitHubModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'fallback-jwt-secret-for-development-only',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {} 