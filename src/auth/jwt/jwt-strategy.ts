import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'ThisIsSecret'
    });
  }

  async validate(payload) {
    const user = await this.authService.tokenValidation(payload);
    if (!user) {
      throw new UnauthorizedException('User does not exist');
    } else if (user) {
      return { uid: user.id, n: user.nickname };
    }
  }
}
