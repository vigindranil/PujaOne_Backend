import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreatePujaAddonDto } from './dto/create-puja-addon.dto';

@Injectable()
export class PujaAddonsService {
  constructor(private readonly supabase: SupabaseService) {}

  async addAddons(pujaId: string, addons: CreatePujaAddonDto[]) {
    if (!addons || addons.length === 0) {
      throw new BadRequestException('Addons array cannot be empty');
    }

    const payload = addons.map(a => ({
      puja_id: pujaId,
      title: a.title,
      description: a.description ?? null,
      price: a.price,
      is_required: a.is_required ?? false,
    }));

    const { error } = await this.supabase.client
      .from('puja_addons')
      .insert(payload);

    if (error) throw new BadRequestException(error.message);

    return { success: true };
  }
}
