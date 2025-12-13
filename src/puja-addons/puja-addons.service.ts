import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreatePujaAddonDto } from './dto/create-puja-addon.dto';
import { UpdatePujaAddonDto } from './dto/update-puja-addon.dto';

@Injectable()
export class PujaAddonsService {
  constructor(private readonly supabase: SupabaseService) {}

  // ============================
  // CREATE ADDON (ADMIN)
  // ============================
  async create(dto: CreatePujaAddonDto) {
    // 🔍 1️⃣ Check Puja exists
    const { data: puja } = await this.supabase.client
      .from('pujas')
      .select('id')
      .eq('id', dto.puja_id)
      .maybeSingle();

    if (!puja) {
      throw new NotFoundException('Puja not found');
    }

    // 🧾 2️⃣ Insert addon
    const { data, error } = await this.supabase.client
      .from('puja_addons')
      .insert(dto)
      .select()
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }

    return data;
  }

  // ============================
  // LIST ADDONS (PUBLIC)
  // ============================
  async findAll(puja_id: string) {
    // 🔍 Optional: validate puja exists
    const { data: puja } = await this.supabase.client
      .from('pujas')
      .select('id')
      .eq('id', puja_id)
      .maybeSingle();

    if (!puja) {
      throw new NotFoundException('Puja not found');
    }

    const { data, error } = await this.supabase.client
      .from('puja_addons')
      .select('*')
      .eq('puja_id', puja_id)
      .order('sort_order', { ascending: true });

    if (error) {
      throw new BadRequestException(error.message);
    }

    return data;
  }

  // ============================
  // UPDATE ADDON (ADMIN)
  // ============================
  async update(id: string, dto: UpdatePujaAddonDto) {
    const { data, error } = await this.supabase.client
      .from('puja_addons')
      .update(dto)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      throw new BadRequestException(error.message);
    }

    if (!data) {
      throw new NotFoundException('Addon not found');
    }

    return data;
  }

  // ============================
  // DELETE ADDON (ADMIN)
  // ============================
  async remove(id: string) {
    const { data, error } = await this.supabase.client
      .from('puja_addons')
      .delete()
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      throw new BadRequestException(error.message);
    }

    if (!data) {
      throw new NotFoundException('Addon not found');
    }

    return { message: 'Addon deleted successfully' };
  }
}
