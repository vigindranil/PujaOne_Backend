import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class PujaRequirementsService {
  constructor(private supabase: SupabaseService) {}

  // ADMIN CREATE
  async create(pujaId: string, dto: any) {
    const { data, error } = await this.supabase.client
      .from('puja_requirements')
      .insert({
        puja_id: pujaId,
        item_name: dto.item_name,
        quantity: dto.quantity,
        notes: dto.notes,
      })
      .select('*')
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  // GET BY PUJA
  async findByPuja(pujaId: string) {
    const { data, error } = await this.supabase.client
      .from('puja_requirements')
      .select('*')
      .eq('puja_id', pujaId);

    if (error) throw new Error(error.message);
    return data;
  }

  // UPDATE
 async update(id: string, dto: any) {
  console.log("🟡 Update Request ID:", id);
  console.log("🟡 Update DTO:", dto);

  const query = this.supabase.client
    .from('puja_requirements')
    .update(dto)
    .eq('id', id)
    .select('*')
    .maybeSingle();

  const { data, error } = await query;

  console.log("🔵 Supabase Response Data:", data);
  console.log("🔴 Supabase Error:", error);

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error(`Requirement not found or RLS blocked update. ID=${id}`);
  }

  return data;
}


  // DELETE
  async remove(id: string) {
    const { error } = await this.supabase.client
      .from('puja_requirements')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
    return { message: 'Requirement deleted successfully' };
  }
}
