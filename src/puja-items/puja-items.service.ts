import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreatePujaItemDto } from './dto/create-puja-item.dto';
import { UpdatePujaItemDto } from './dto/update-puja-item.dto';

@Injectable()
export class PujaItemsService {
  constructor(private readonly supabase: SupabaseService) {}

  // ============================
  // ADMIN: ADD ITEM TO PUJA
  // ============================
  async create(puja_id: string, dto: CreatePujaItemDto) {
    // 🔍 Check puja exists
    const { data: puja } = await this.supabase.client
      .from('pujas')
      .select('id')
      .eq('id', puja_id)
      .maybeSingle();

    if (!puja) {
      throw new NotFoundException('Puja not found');
    }

    const { data, error } = await this.supabase.client
      .from('puja_items')
      .insert({
        puja_id,
        item_name: dto.item_name,
        quantity: dto.quantity ?? null,
        notes: dto.notes ?? null,
      })
      .select('*')
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }

    return data;
  }

  // ============================
  // PUBLIC: GET ITEMS BY PUJA
  // ============================
  async findByPuja(puja_id: string) {
    // 🔍 Validate puja exists
    const { data: puja } = await this.supabase.client
      .from('pujas')
      .select('id')
      .eq('id', puja_id)
      .maybeSingle();

    if (!puja) {
      throw new NotFoundException('Puja not found');
    }

    const { data, error } = await this.supabase.client
      .from('puja_items')
      .select('*')
      .eq('puja_id', puja_id)
      .order('created_at', { ascending: true });

    if (error) {
      throw new BadRequestException(error.message);
    }

    return data;
  }

  // ============================
  // ADMIN: UPDATE ITEM
  // ============================
  async update(id: string, dto: UpdatePujaItemDto) {
    const { data, error } = await this.supabase.client
      .from('puja_items')
      .update(dto)
      .eq('id', id)
      .select('*')
      .maybeSingle();

    if (error) {
      throw new BadRequestException(error.message);
    }

    if (!data) {
      throw new NotFoundException('Puja item not found');
    }

    return data;
  }

  // ============================
  // ADMIN: DELETE ITEM
  // ============================
  async remove(id: string) {
    // 🔍 Check exists
    const { data: item } = await this.supabase.client
      .from('puja_items')
      .select('id')
      .eq('id', id)
      .maybeSingle();

    if (!item) {
      throw new NotFoundException('Puja item not found');
    }

    const { error } = await this.supabase.client
      .from('puja_items')
      .delete()
      .eq('id', id);

    if (error) {
      throw new BadRequestException(error.message);
    }

    return { message: 'Item deleted successfully' };
  }
}
