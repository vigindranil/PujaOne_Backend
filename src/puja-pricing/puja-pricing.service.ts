import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreatePricingOptionDto } from './dto/create-pricing.dto';
import { UpdatePricingOptionDto } from './dto/update-pricing.dto';

@Injectable()
export class PujaPricingService {
  constructor(private supabase: SupabaseService) {}

  async create(puja_id: string, dto: CreatePricingOptionDto) {
    const { data, error } = await this.supabase.client
      .from('puja_pricing_options')
      .insert({ puja_id, ...dto })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async findAll(puja_id: string) {
    const { data, error } = await this.supabase.client
      .from('puja_pricing_options')
      .select('*')
      .eq('puja_id', puja_id)
      .order('sort_order');

    if (error) throw error;
    return data;
  }

  async update(id: string, dto: UpdatePricingOptionDto) {
    const { data, error } = await this.supabase.client
      .from('puja_pricing_options')
      .update({ ...dto, updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) throw new NotFoundException("Pricing option not found");
    return data;
  }

  async remove(id: string) {
    const { error } = await this.supabase.client
      .from('puja_pricing_options')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { message: "Pricing option deleted" };
  }
}
