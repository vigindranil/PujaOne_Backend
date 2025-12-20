import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreatePujaDto } from './dto/create-puja.dto';
import { UpdatePujaDto } from './dto/update-puja.dto';

@Injectable()
export class PujasService {
  constructor(private readonly supabase: SupabaseService) {}

  // -------------------------
  // LIGHTWEIGHT LIST
  // -------------------------
  async list(opts: {
    limit: number;
    offset: number;
    category?: string;
    search?: string;
    featured?: boolean;
  }) {
    const { limit, offset, category, search, featured } = opts;

    let query = this.supabase.client
      .from('puja_list')
      .select('*')
      .range(offset, offset + limit - 1);

    if (category) query = query.eq('category_name', category);
    if (featured !== undefined) query = query.eq('featured', featured);
    if (search) query = query.ilike('title', `%${search}%`);

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    return data;
  }

  // -------------------------
  // 🔥 FULL PUJA (INTERNAL)
  // -------------------------
  async getOneFull(id: string) {
    const { data: puja, error } = await this.supabase.client
      .from('pujas')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !puja) throw new BadRequestException('Puja not found');

    const [
      { data: items },
      { data: addons },
      { data: requirements },
      { data: pricing },
      { data: gallery },
    ] = await Promise.all([
      this.supabase.client.from('puja_items').select('*').eq('puja_id', id),
      this.supabase.client.from('puja_addons').select('*').eq('puja_id', id),
      this.supabase.client.from('puja_requirements').select('*').eq('puja_id', id),
      this.supabase.client
        .from('puja_pricing_options')
        .select('*')
        .eq('puja_id', id)
        .eq('is_active', true)
        .order('sort_order'),
      this.supabase.client
        .from('puja_gallery')
        .select('*')
        .eq('puja_id', id)
        .order('sort_order'),
    ]);

    return {
      ...puja,
      items: items ?? [],
      addons: addons ?? [],
      requirements: requirements ?? [],
      pricing: pricing ?? [],
      gallery: gallery ?? [],
    };
  }

  // -------------------------
  // 🔥 PUBLIC AGGREGATED API
  // -------------------------
  async getPujaDetails(opts: {
    pujaId?: string;
    categoryId?: string;
  }) {
    const { pujaId, categoryId } = opts;

    if (!pujaId && !categoryId) {
      throw new BadRequestException(
        'Either puja_id or category_id is required',
      );
    }

    // Single puja
    if (pujaId) {
      return this.getOneFull(pujaId);
    }

    // All pujas in category
    const { data: pujas, error } = await this.supabase.client
      .from('pujas')
      .select('id')
      .eq('category_id', categoryId)
      .eq('is_active', true);

    if (error) throw new Error(error.message);

    const result = [];
    return Promise.all(
    (pujas ?? []).map(p => this.getOneFull(p.id)),
  );
  }

  // -------------------------
  // ADMIN CREATE
  // -------------------------
  async create(dto: CreatePujaDto) {
    const insert = {
      title: dto.title,
      slug: dto.slug,
      category_id: dto.category_id ?? null,
      short_description: dto.short_description ?? null,
      long_description: dto.long_description ?? null,
      base_price: dto.base_price ?? 0,
      duration_minutes: dto.duration_minutes ?? 60,
      image_url: dto.image_url ?? null,
      featured: dto.featured ?? false,
      is_active: true,
    };

    const { data, error } = await this.supabase.client
      .from('pujas')
      .insert(insert)
      .select('*')
      .single();

    if (error) throw new Error(error.message);

    try {
      await this.supabase.client.rpc('refresh_puja_list');
    } catch {}

    return data;
  }

  // -------------------------
  // ADMIN UPDATE
  // -------------------------
  async update(id: string, dto: UpdatePujaDto) {
    const { data, error } = await this.supabase.client
      .from('pujas')
      .update({
        ...dto,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
}
