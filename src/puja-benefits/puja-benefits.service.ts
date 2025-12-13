import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreatePujaBenefitDto } from './dto/create-puja-benefit.dto';
import { UpdatePujaBenefitDto } from './dto/update-puja-benefit.dto';

@Injectable()
export class PujaBenefitsService {
  constructor(private readonly supabase: SupabaseService) {}

  // ============================
  // CREATE BENEFIT (ADMIN)
  // ============================
  async create(puja_id: string, dto: CreatePujaBenefitDto) {
    // 🔍 1️⃣ Check puja exists
    const { data: puja } = await this.supabase.client
      .from('pujas')
      .select('id')
      .eq('id', puja_id)
      .maybeSingle();

    if (!puja) {
      throw new NotFoundException('Puja not found');
    }

    // 🧾 2️⃣ Insert benefit
    const { data, error } = await this.supabase.client
      .from('puja_benefits')
      .insert({
        puja_id,
        title: dto.title,
        description: dto.description ?? null,
        sort_order: dto.sort_order ?? 1,
      })
      .select()
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }

    return data;
  }

  // ============================
  // LIST BENEFITS (PUBLIC)
  // ============================
  async findAll(puja_id: string) {
    // 🔍 Optional but recommended
    const { data: puja } = await this.supabase.client
      .from('pujas')
      .select('id')
      .eq('id', puja_id)
      .maybeSingle();

    if (!puja) {
      throw new NotFoundException('Puja not found');
    }

    const { data, error } = await this.supabase.client
      .from('puja_benefits')
      .select('*')
      .eq('puja_id', puja_id)
      .order('sort_order', { ascending: true });

    if (error) {
      throw new BadRequestException(error.message);
    }

    return data;
  }

  // ============================
  // UPDATE BENEFIT (ADMIN)
  // ============================
  async update(id: string, dto: UpdatePujaBenefitDto) {
    const { data, error } = await this.supabase.client
      .from('puja_benefits')
      .update(dto)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      throw new BadRequestException(error.message);
    }

    if (!data) {
      throw new NotFoundException('Benefit not found');
    }

    return data;
  }

  // ============================
  // DELETE BENEFIT (ADMIN)
  // ============================
  async remove(id: string) {
    const { data, error } = await this.supabase.client
      .from('puja_benefits')
      .delete()
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      throw new BadRequestException(error.message);
    }

    if (!data) {
      throw new NotFoundException('Benefit not found');
    }

    return { message: 'Benefit deleted successfully' };
  }
}
