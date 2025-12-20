import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreatePujaItemDto } from './dto/create-puja-item.dto';

@Injectable()
export class PujaItemsService {
  constructor(private readonly supabase: SupabaseService) {}

  async addItems(pujaId: string, items: CreatePujaItemDto[]) {
    if (!items || items.length === 0) {
      throw new BadRequestException('Items array cannot be empty');
    }

    const payload = items.map(i => ({
      puja_id: pujaId,
      item_name: i.item_name,
      quantity: i.quantity ?? null,
      notes: i.notes ?? null,
    }));

    const { error } = await this.supabase.client
      .from('puja_items')
      .insert(payload);

    if (error) throw new BadRequestException(error.message);

    return { success: true };
  }
}
