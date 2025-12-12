import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUserByPhone(phone: string, pass: string) {
    const user = await this.usersService.findByPhone(phone);
    if (!user || !user.password_hash) return null;
    const ok = await bcrypt.compare(pass, user.password_hash);
    if (ok) {
      const { password_hash, ...safe } = user;
      return safe;
    }
    return null;
  }

  async login(user: any) {
    const payload = { sub: user.id, role: user.role, phone: user.phone };
    return {
      access_token: this.jwtService.sign(payload),
      expires_in: process.env.JWT_EXPIRES_IN || '3600s',
    };
  }

  async register(dto: { name: string; phone: string; password: string; role?: string }) {
    const saltRounds = 12;
    const hash = await bcrypt.hash(dto.password, saltRounds);
    const user = await this.usersService.create({
      name: dto.name,
      phone: dto.phone,
      password_hash: hash,
      role: dto.role ?? 'USER',
    });
    return user;
  }
}
