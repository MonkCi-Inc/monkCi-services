import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private jwtService: JwtService) {
    const secret = process.env.JWT_SECRET || 'fallback-jwt-secret-for-development-only';
    
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (request) => {
          
          const token = request?.cookies?.monkci_token;          
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.userId,
      githubId: payload.githubId, // Optional - may not exist for email-only users
      login: payload.login, // Optional - may not exist for email-only users
      name: payload.name,
      email: payload.email,
      avatarUrl: payload.avatarUrl, // Optional - may not exist for email-only users
      emailAuthId: payload.emailAuthId, // Optional - may not exist for GitHub-only users
      installations: payload.installations || [], // Optional - may not exist for email-only users
    };
  }
} 