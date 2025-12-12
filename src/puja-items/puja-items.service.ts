import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreatePujaItemDto } from './dto/create-puja-item.dto';
import { UpdatePujaItemDto } from './dto/update-puja-item.dto';

@Injectable()
export class PujaItemsService {
  constructor(private supabase: SupabaseService) {}

  // ⭐ Admin: Add item to a puja
  async create(puja_id: string, dto: CreatePujaItemDto) {
    const { data, error } = await this.supabase.client
      .from('puja_items')
      .insert({
        puja_id,
        item_name: dto.item_name,
        quantity: dto.quantity,
        notes: dto.notes
      })
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  // ⭐ Public: Get all items for a puja
  async findByPuja(puja_id: string) {
    const { data, error } = await this.supabase.client
      .from('puja_items')
      .select("*")
      .eq('puja_id', puja_id);

    if (error) throw new Error(error.message);
    return data;
  }

  // ⭐ Admin: Update item
  async update(id: string, dto: UpdatePujaItemDto) {
    const { data, error } = await this.supabase.client
      .from('puja_items')
      .update(dto)
      .eq('id', id)
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  // ⭐ Admin: Delete item
  async remove(id: string) {
    const { error } = await this.supabase.client
      .from('puja_items')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);

    return { message: "Item deleted successfully" };
  }
}
