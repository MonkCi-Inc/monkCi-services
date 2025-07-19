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
      githubId: payload.githubId,
      login: payload.login,
      name: payload.name,
      email: payload.email,
      avatarUrl: payload.avatarUrl,
      installations: payload.installations,
    };
  }
} 