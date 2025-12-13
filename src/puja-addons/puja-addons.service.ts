import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreatePujaAddonDto } from './dto/create-puja-addon.dto';
import { UpdatePujaAddonDto } from './dto/update-puja-addon.dto';

@Injectable()
export class PujaAddonsService {
  constructor(private supabase: SupabaseService) {}

  async create(dto: CreatePujaAddonDto) {
    const { data, error } = await this.supabase.client
      .from('puja_addons')
      .insert(dto)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async findAll(puja_id: string) {
    const { data, error } = await this.supabase.client
      .from('puja_addons')
      .select('*')
      .eq('puja_id', puja_id)
      .order('sort_order');

    if (error) throw error;
    return data;
  }

  async update(id: string, dto: UpdatePujaAddonDto) {
    const { data, error } = await this.supabase.client
      .from('puja_addons')
      .update(dto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new NotFoundException('Addon not found');

    return data;
  }

  async remove(id: string) {
    const { error } = await this.supabase.client
      .from('puja_addons')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return { message: 'Addon deleted successfully' };
  }
}
