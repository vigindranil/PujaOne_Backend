import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreatePricingOptionDto } from './dto/create-pricing.dto';
import { UpdatePricingOptionDto } from './dto/update-pricing.dto';

@Injectable()
export class PujaPricingService {
  constructor(private readonly supabase: SupabaseService) {}

  // =========================
  // PRICING OPTION CRUD
  // =========================

  async create(puja_id: string, dto: CreatePricingOptionDto) {
    const { data, error } = await this.supabase.client
      .from('puja_pricing_options')
      .insert({ puja_id, ...dto })
      .select()
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async findAll(puja_id: string) {
    const { data, error } = await this.supabase.client
      .from('puja_pricing_options')
      .select('*')
      .eq('puja_id', puja_id)
      .eq('is_active', true)
      .order('sort_order');

    if (error) throw new BadRequestException(error.message);
    return data ?? [];
  }

  async update(id: string, dto: UpdatePricingOptionDto) {
    const { data, error } = await this.supabase.client
      .from('puja_pricing_options')
      .update({ ...dto, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new BadRequestException(error.message);
    if (!data) throw new NotFoundException('Pricing option not found');
    return data;
  }

  async remove(id: string) {
    const { error } = await this.supabase.client
      .from('puja_pricing_options')
      .delete()
      .eq('id', id);

    if (error) throw new BadRequestException(error.message);
    return { message: 'Pricing option deleted' };
  }

  // =========================
  // PACKAGE → ADDON
  // =========================

  async addAddonToPackage(pricingId: string, addonId: string) {
    const { error } = await this.supabase.client
      .from('puja_pricing_addons')
      .insert({ pricing_id: pricingId, addon_id: addonId });

    if (error) throw new BadRequestException(error.message);
    return { message: 'Addon added to package' };
  }

  async removeAddonFromPackage(pricingId: string, addonId: string) {
    const { error } = await this.supabase.client
      .from('puja_pricing_addons')
      .delete()
      .eq('pricing_id', pricingId)
      .eq('addon_id', addonId);

    if (error) throw new BadRequestException(error.message);
    return { message: 'Addon removed from package' };
  }

  async getPackageAddons(pricingId: string) {
    const { data, error } = await this.supabase.client
      .from('puja_pricing_addons')
      .select(`
        puja_addons (
          id,
          title,
          description,
          price
        )
      `)
      .eq('pricing_id', pricingId);

    if (error) throw new BadRequestException(error.message);
    return (data ?? []).map(r => r.puja_addons);
  }

  // =========================
  // PACKAGE → REQUIREMENT
  // =========================

  async addRequirementToPackage(pricingId: string, requirementId: string) {
    const { error } = await this.supabase.client
      .from('puja_pricing_requirements')
      .insert({ pricing_id: pricingId, requirement_id: requirementId });

    if (error) throw new BadRequestException(error.message);
    return { message: 'Requirement added to package' };
  }

  async removeRequirementFromPackage(pricingId: string, requirementId: string) {
    const { error } = await this.supabase.client
      .from('puja_pricing_requirements')
      .delete()
      .eq('pricing_id', pricingId)
      .eq('requirement_id', requirementId);

    if (error) throw new BadRequestException(error.message);
    return { message: 'Requirement removed from package' };
  }

  async getPackageRequirements(pricingId: string) {
    const { data, error } = await this.supabase.client
      .from('puja_pricing_requirements')
      .select(`
        puja_requirements (
          id,
          item_name,
          quantity,
          notes
        )
      `)
      .eq('pricing_id', pricingId);

    if (error) throw new BadRequestException(error.message);
    return (data ?? []).map(r => r.puja_requirements);
  }
}
