import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class UsersService {
  constructor(private readonly supabase: SupabaseService) {}

  async findByPhone(phone: string) {
    const res = await this.supabase.client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();
    if (res.error) return null;
    return res.data;
  }

  async create(payload: { name: string; phone: string; password_hash: string; role?: string }) {
    const res = await this.supabase.client.from('users').insert({
      name: payload.name,
      phone: payload.phone,
      password_hash: payload.password_hash,
      role: payload.role ?? 'USER',
    }).select().single();
    if (res.error) throw new Error(res.error.message);
    return res.data;
  }

  async findById(id: string) {
    const res = await this.supabase.client.from('users').select('*').eq('id', id).single();
    if (res.error) return null;
    return res.data;
  }
}
