import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class PujaRequirementsService {
  constructor(private supabase: SupabaseService) {}

  // =========================
  // ADMIN CREATE
  // =========================
  async create(pujaId: string, dto: any) {
    const { data, error } = await this.supabase.client
      .from('puja_requirements')
      .insert({
        puja_id: pujaId,
        item_name: dto.item_name,
        quantity: dto.quantity ?? null,
        notes: dto.notes ?? null,
      })
      .select('*')
      .single();

    if (error) {
      throw new BadRequestException(
        `Failed to create requirement: ${error.message}`,
      );
    }

    if (!data) {
      throw new InternalServerErrorException(
        'Requirement created but no data returned',
      );
    }

    return data;
  }

  // =========================
  // GET BY PUJA
  // =========================
  async findByPuja(pujaId: string) {
    const { data, error } = await this.supabase.client
      .from('puja_requirements')
      .select('*')
      .eq('puja_id', pujaId);

    if (error) {
      throw new BadRequestException(
        `Failed to fetch requirements: ${error.message}`,
      );
    }

    return data ?? [];
  }

  // =========================
  // UPDATE REQUIREMENT
  // =========================
  async update(id: string, dto: any) {
    const { data, error } = await this.supabase.client
      .from('puja_requirements')
      .update({
        item_name: dto.item_name,
        quantity: dto.quantity ?? null,
        notes: dto.notes ?? null,
      })
      .eq('id', id)
      .select('*')
      .maybeSingle();

    if (error) {
      throw new BadRequestException(
        `Failed to update requirement: ${error.message}`,
      );
    }

    if (!data) {
      throw new NotFoundException(
        `Requirement not found or update blocked (ID=${id})`,
      );
    }

    return data;
  }

  // =========================
  // DELETE REQUIREMENT
  // =========================
  async remove(id: string) {
    const { error } = await this.supabase.client
      .from('puja_requirements')
      .delete()
      .eq('id', id);

    if (error) {
      throw new BadRequestException(
        `Failed to delete requirement: ${error.message}`,
      );
    }

    return { message: 'Requirement deleted successfully' };
  }
}
