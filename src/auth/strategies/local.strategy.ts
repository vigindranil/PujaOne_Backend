import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    // configure to use phone as usernameField
    super({ usernameField: 'phone', passwordField: 'password' });
  }

  async validate(phone: string, password: string) {
    const user = await this.authService.validateUserByPhone(phone, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
