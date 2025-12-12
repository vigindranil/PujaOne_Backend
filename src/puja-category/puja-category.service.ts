import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreatePujaCategoryDto } from './dto/create-puja-category.dto';
import { UpdatePujaCategoryDto } from './dto/update-puja-category.dto';
import slugify from 'slugify';

@Injectable()
export class PujaCategoryService {
  constructor(private supabase: SupabaseService) {}

  async create(dto: CreatePujaCategoryDto) {
  const slug = slugify(dto.name, { lower: true, strict: true });

  const { data, error } = await this.supabase.client
    .from('puja_categories')
    .insert({
      name: dto.name,
      slug,
      description: dto.description ?? null,
      icon_url: dto.icon_url ?? null,
      is_active: dto.is_active ?? true,   // <--- Default TRUE here!
    })
    .select('*')
    .single();

  if (error) throw new Error(error.message);
  return data;
}

  async findAll() {
    const { data, error } = await this.supabase.client
      .from('puja_categories')
      .select('*')
      .order('name');

    if (error) throw new Error(error.message);
    return data;
  }

  async findOne(id: string) {
    const { data, error } = await this.supabase.client
      .from('puja_categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async update(id: string, dto: UpdatePujaCategoryDto) {
    const { data, error } = await this.supabase.client
      .from('puja_categories')
      .update(dto)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async remove(id: string) {
    const { error } = await this.supabase.client
      .from('puja_categories')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
    return { message: 'Category deleted successfully' };
  }
}
