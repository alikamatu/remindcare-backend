import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: (config.get<string>('CLERK_JWT_PUBLIC_KEY') || '').replace(/\\n/g, '\n'),
    });
  }

  async validate(payload: any) {
    return { 
      clerkUserId: payload.sub, 
      role: payload.public_metadata?.role,
      facilityId: payload.public_metadata?.facilityId
    };
  }
}