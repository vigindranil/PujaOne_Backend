import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateSamagriKitDto } from './dto/create-kit.dto';
import { UpdateSamagriKitDto } from './dto/update-kit.dto';
import { AddKitItemDto } from './dto/add-kit-item.dto';
import { UpdateKitItemDto } from './dto/update-kit-item.dto';

@Injectable()
export class SamagriKitsService {
  constructor(private supabase: SupabaseService) {}

  // =========================
  // CREATE KIT
  // =========================
  async create(dto: CreateSamagriKitDto) {
    const { data, error } = await this.supabase.client
      .from('samagri_kits')
      .insert(dto)
      .select()
      .maybeSingle();

    if (error) {
      throw new BadRequestException(
        `Failed to create Samagri kit: ${error.message}`,
      );
    }

    if (!data) {
      throw new InternalServerErrorException(
        'Samagri kit created but no data returned',
      );
    }

    return data;
  }

  // =========================
  // GET KITS BY PUJA
  // =========================
  async findByPuja(puja_id: string) {
    const { data, error } = await this.supabase.client
      .from('samagri_kits')
      .select('*')
      .eq('puja_id', puja_id)
      .eq('is_active', true);

    if (error) {
      throw new BadRequestException(
        `Failed to fetch kits: ${error.message}`,
      );
    }

    return data ?? [];
  }

  // =========================
  // UPDATE KIT
  // =========================
  async update(id: string, dto: UpdateSamagriKitDto) {
    const { data, error } = await this.supabase.client
      .from('samagri_kits')
      .update(dto)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      throw new BadRequestException(
        `Failed to update kit: ${error.message}`,
      );
    }

    if (!data) {
      throw new NotFoundException(`Samagri kit not found (id=${id})`);
    }

    return data;
  }

  // =========================
  // DELETE KIT
  // =========================
  async remove(id: string) {
    const { error } = await this.supabase.client
      .from('samagri_kits')
      .delete()
      .eq('id', id);

    if (error) {
      throw new BadRequestException(
        `Failed to delete kit: ${error.message}`,
      );
    }

    return { message: 'Kit deleted successfully' };
  }

  // =========================
  // ADD ITEM TO KIT
  // =========================
  async addItem(dto: AddKitItemDto) {
    const { data, error } = await this.supabase.client
      .from('samagri_kit_items')
      .insert(dto)
      .select()
      .maybeSingle();

    if (error) {
      throw new BadRequestException(
        `Failed to add kit item: ${error.message}`,
      );
    }

    if (!data) {
      throw new InternalServerErrorException(
        'Item added but no data returned',
      );
    }

    return data;
  }

  // =========================
  // UPDATE KIT ITEM
  // =========================
  async updateItem(id: string, dto: UpdateKitItemDto) {
    const { data, error } = await this.supabase.client
      .from('samagri_kit_items')
      .update(dto)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      throw new BadRequestException(
        `Failed to update kit item: ${error.message}`,
      );
    }

    if (!data) {
      throw new NotFoundException(`Kit item not found (id=${id})`);
    }

    return data;
  }

  // =========================
  // DELETE KIT ITEM
  // =========================
  async removeItem(id: string) {
    const { error } = await this.supabase.client
      .from('samagri_kit_items')
      .delete()
      .eq('id', id);

    if (error) {
      throw new BadRequestException(
        `Failed to remove kit item: ${error.message}`,
      );
    }

    return { message: 'Item removed successfully' };
  }
}
