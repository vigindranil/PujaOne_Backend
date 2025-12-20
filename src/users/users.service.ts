import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private readonly supabase: SupabaseService) {}

  // =========================
  // 🔍 FIND USER BY PHONE
  // =========================
  async findByPhone(phone: string) {
    const res = await this.supabase.client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (res.error) return null;
    return res.data;
  }

  // =========================
  // 👤 CREATE USER (OTP / ADMIN)
  // =========================
  async create(payload: {
    phone: string;
    name?: string | null;
    email?: string | null;
    password_hash?: string | null;
    role?: string;
    is_verified?: boolean;
  }) {
    const res = await this.supabase.client
      .from('users')
      .insert({
        phone: payload.phone,
        name: payload.name ?? null,
        email: payload.email ?? null,
        password_hash: payload.password_hash ?? null,
        role: payload.role ?? 'USER',
        is_verified: payload.is_verified ?? false,
      })
      .select()
      .single();

    if (res.error) throw new Error(res.error.message);
    return res.data;
  }

  // =========================
  // 🔍 FIND USER BY ID
  // =========================
  async findById(id: string) {
    const res = await this.supabase.client
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (res.error) return null;
    return res.data;
  }

  // =========================
  // ✏️ UPDATE PROFILE (POST OTP)
  // =========================
  async updateProfile(userId: string, dto: UpdateProfileDto) {
    if (!userId) {
      throw new BadRequestException('Invalid user id');
    }

    // 1️⃣ Update user basic info
    const { error: userErr } = await this.supabase.client
      .from('users')
      .update({
        name: dto.name,
        email: dto.email,
      })
      .eq('id', userId);

    if (userErr) throw new BadRequestException(userErr.message);

    // 2️⃣ Check if default address already exists
    const { data: existing } = await this.supabase.client
      .from('user_addresses')
      .select('id')
      .eq('user_id', userId)
      .eq('is_default', true)
      .maybeSingle();

    // 3️⃣ Insert default address if not exists
    if (!existing) {
      const { error: addrErr } = await this.supabase.client
        .from('user_addresses')
        .insert({
          user_id: userId,
          label: dto.address_label ?? 'Home',
          address: dto.address,
          is_default: true,
        });

      if (addrErr) throw new BadRequestException(addrErr.message);
    }

    return { success: true };
  }

  // =========================
  // 📍 GET MY SAVED ADDRESSES
  // =========================
  async getMyAddresses(userId: string) {
    if (!userId) {
      throw new BadRequestException('Invalid user id');
    }

    const { data, error } = await this.supabase.client
      .from('user_addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw new BadRequestException(error.message);
    return data;
  }
}
