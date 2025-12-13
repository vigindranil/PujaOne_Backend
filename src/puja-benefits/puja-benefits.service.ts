import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreatePujaBenefitDto } from './dto/create-puja-benefit.dto';
import { UpdatePujaBenefitDto } from './dto/update-puja-benefit.dto';

@Injectable()
export class PujaBenefitsService {
  constructor(private supabase: SupabaseService) {}

  async create(puja_id: string, dto: CreatePujaBenefitDto) {
    const { data, error } = await this.supabase.client
      .from("puja_benefits")
      .insert({
        puja_id,
        title: dto.title,
        description: dto.description ?? null,
        sort_order: dto.sort_order ?? 1
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async findAll(puja_id: string) {
    const { data, error } = await this.supabase.client
      .from("puja_benefits")
      .select("*")
      .eq("puja_id", puja_id)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data;
  }

  async update(id: string, dto: UpdatePujaBenefitDto) {
    const { data, error } = await this.supabase.client
      .from("puja_benefits")
      .update(dto)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new NotFoundException("Benefit not found");

    return data;
  }

  async remove(id: string) {
    const { error } = await this.supabase.client
      .from("puja_benefits")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return { message: "Benefit deleted successfully" };
  }
}
