import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreatePujaDto } from './dto/create-puja.dto';
import { UpdatePujaDto } from './dto/update-puja.dto';

@Injectable()
export class PujasService {
  constructor(private supabase: SupabaseService) {}

  async list(opts: { limit: number; offset: number; category?: string; search?: string; featured?: boolean }) {
    const { limit, offset, category, search, featured } = opts;
    let query = this.supabase.client
      .from('puja_list')
      .select('*')
      .range(offset, offset + limit - 1);

    if (category) {
      query = query.filter('category_name', 'eq', category);
    }
    if (featured !== undefined) {
      query = query.filter('featured', 'eq', featured);
    }
    if (search) {
      // use PostgREST full text / or ilike
      query = query.ilike('title', `%${search}%`);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
  }

  async getOne(id: string) {
    const { data: puja, error: pujaErr } = await this.supabase.client
      .from('pujas')
      .select('*')
      .eq('id', id)
      .single();

    if (pujaErr) throw new Error(pujaErr.message);

    const { data: items } = await this.supabase.client
      .from('puja_items')
      .select('*')
      .eq('puja_id', id);

    const { data: addons } = await this.supabase.client
      .from('puja_addons')
      .select('*')
      .eq('puja_id', id);

    return { ...puja, items: items ?? [], addons: addons ?? [] };
  }

  async create(dto: CreatePujaDto) {
    // insert primary puja
    const pujaInsert = {
      title: dto.title,
      slug: dto.slug,
      category_id: dto.category_id ?? null,
      short_description: dto.short_description ?? null,
      long_description: dto.long_description ?? null,
      base_price: dto.base_price ?? 0.0,
      duration_minutes: dto.duration_minutes ?? 60,
      image_url: dto.image_url ?? null,
      featured: dto.featured ?? false,
      is_active: true,
    };

    const { data: puja, error: pujaErr } = await this.supabase.client
      .from('pujas')
      .insert(pujaInsert)
      .select('*')
      .single();

    if (pujaErr) throw new Error(pujaErr.message);

    // items
    if (dto.items && dto.items.length > 0) {
      const itemsToInsert = dto.items.map(i => ({
        puja_id: puja.id,
        item_name: i.item_name,
        quantity: i.quantity,
        notes: i.notes,
      }));
      const { error: itemsErr } = await this.supabase.client.from('puja_items').insert(itemsToInsert);
      if (itemsErr) throw new Error(itemsErr.message);
    }

    // addons
    if (dto.addons && dto.addons.length > 0) {
      const addonsToInsert = dto.addons.map(a => ({
        puja_id: puja.id,
        title: a.title,
        description: a.description,
        price: a.price,
      }));
      const { error: addonsErr } = await this.supabase.client.from('puja_addons').insert(addonsToInsert);
      if (addonsErr) throw new Error(addonsErr.message);
    }

    // Refresh materialized view (optional)
    try {
      await this.supabase.client.rpc('refresh_puja_list'); // only if you create an rpc
    } catch (_) {}

    return puja;
  }

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
