import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreatePujaCategoryDto } from './dto/create-puja-category.dto';
import { UpdatePujaCategoryDto } from './dto/update-puja-category.dto';
import slugify from 'slugify';

@Injectable()
export class PujaCategoryService {
  constructor(private readonly supabase: SupabaseService) {}

  // ============================
  // CREATE CATEGORY (ADMIN)
  // ============================
  async create(dto: CreatePujaCategoryDto) {
    const slug = slugify(dto.name, { lower: true, strict: true });

    // 🔍 Check slug uniqueness
    const { data: existing } = await this.supabase.client
      .from('puja_categories')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();

    if (existing) {
      throw new ConflictException('Category with same name already exists');
    }

    const { data, error } = await this.supabase.client
      .from('puja_categories')
      .insert({
        name: dto.name,
        slug,
        description: dto.description ?? null,
        icon_url: dto.icon_url ?? null,
        is_active: dto.is_active ?? true,
      })
      .select()
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }

    return data;
  }

  // ============================
  // LIST CATEGORIES (PUBLIC)
  // ============================
  async findAll() {
    const { data, error } = await this.supabase.client
      .from('puja_categories')
      .select('*')
      .order('name');

    if (error) {
      throw new BadRequestException(error.message);
    }

    return data;
  }

  // ============================
  // GET ONE CATEGORY
  // ============================
  async findOne(id: string) {
    const { data, error } = await this.supabase.client
      .from('puja_categories')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new BadRequestException(error.message);
    }

    if (!data) {
      throw new NotFoundException('Category not found');
    }

    return data;
  }

  // ============================
  // UPDATE CATEGORY (ADMIN)
  // ============================
  async update(id: string, dto: UpdatePujaCategoryDto) {
    // 🔍 Check exists
    const { data: exists } = await this.supabase.client
      .from('puja_categories')
      .select('id')
      .eq('id', id)
      .maybeSingle();

    if (!exists) {
      throw new NotFoundException('Category not found');
    }

    // 🔄 Regenerate slug if name changes
    const updatePayload: any = { ...dto };
    if (dto.name) {
      updatePayload.slug = slugify(dto.name, {
        lower: true,
        strict: true,
      });
    }

    const { data, error } = await this.supabase.client
      .from('puja_categories')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }

    return data;
  }

  // ============================
  // DELETE CATEGORY (ADMIN)
  // ============================
  async remove(id: string) {
    const { data, error } = await this.supabase.client
      .from('puja_categories')
      .delete()
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      throw new BadRequestException(error.message);
    }

    if (!data) {
      throw new NotFoundException('Category not found');
    }

    return { message: 'Category deleted successfully' };
  }
}
