import { Injectable,UnauthorizedException } from '@nestjs/common';
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

  async register(dto: { name: string; phone: string; email?: string; password: string; role?: string }) {
    const saltRounds = 12;
    const hash = await bcrypt.hash(dto.password, saltRounds);
    const user = await this.usersService.create({
      name: dto.name,
      phone: dto.phone,
      email: dto.email ?? undefined, 
      password_hash: hash,
      role: dto.role ?? 'USER',
    });
    return user;
  }

   // =========================
  // SEND OTP (DEV MODE)
  // =========================
  async sendOtp(phone: string) {
    // DEV MODE ONLY — no SMS
    return {
      success: true,
      message: 'OTP sent successfully (DEV MODE)',
      otp: '999999', // optional: remove in prod
    };
  }

  // =========================
  // VERIFY OTP + AUTO REGISTER
  // =========================
  async verifyOtp(phone: string, otp: string) {
    // DEV OTP CHECK
    if (otp !== '999999') {
      throw new UnauthorizedException('Invalid OTP');
    }

    // FIND USER
    let user = await this.usersService.findByPhone(phone);

    // AUTO REGISTER IF NOT EXISTS
    if (!user) {
      user = await this.usersService.create({
        phone,
        role: 'USER',
        is_verified: true,
      });
    }

    // JWT PAYLOAD
    const payload = {
      sub: user.id,
      phone: user.phone,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
  
}
