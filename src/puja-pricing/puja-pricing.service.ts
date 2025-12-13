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
  constructor(private supabase: SupabaseService) {}

  // =========================
  // CREATE PRICING OPTION
  // =========================
  async create(puja_id: string, dto: CreatePricingOptionDto) {
    const { data, error } = await this.supabase.client
      .from('puja_pricing_options')
      .insert({ puja_id, ...dto })
      .select()
      .single();

    if (error) {
      throw new BadRequestException(
        `Failed to create pricing option: ${error.message}`,
      );
    }

    if (!data) {
      throw new InternalServerErrorException(
        'Pricing option created but no data returned',
      );
    }

    return data;
  }

  // =========================
  // LIST PRICING OPTIONS
  // =========================
  async findAll(puja_id: string) {
    const { data, error } = await this.supabase.client
      .from('puja_pricing_options')
      .select('*')
      .eq('puja_id', puja_id)
      .order('sort_order');

    if (error) {
      throw new BadRequestException(
        `Failed to fetch pricing options: ${error.message}`,
      );
    }

    return data ?? [];
  }

  // =========================
  // UPDATE PRICING OPTION
  // =========================
  async update(id: string, dto: UpdatePricingOptionDto) {
    const { data, error } = await this.supabase.client
      .from('puja_pricing_options')
      .update({ ...dto, updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new BadRequestException(
        `Failed to update pricing option: ${error.message}`,
      );
    }

    if (!data) {
      throw new NotFoundException('Pricing option not found');
    }

    return data;
  }

  // =========================
  // DELETE PRICING OPTION
  // =========================
  async remove(id: string) {
    const { error } = await this.supabase.client
      .from('puja_pricing_options')
      .delete()
      .eq('id', id);

    if (error) {
      throw new BadRequestException(
        `Failed to delete pricing option: ${error.message}`,
      );
    }

    return { message: 'Pricing option deleted successfully' };
  }

  // =========================
  // 👑 ADMIN PUROHIT CALENDAR
  // =========================
  async getAdminCalendar(month: number, year: number) {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month).padStart(2, '0')}-31`;

    // 1️⃣ PUROHITS
    const { data: purohits, error: pErr } = await this.supabase.client
      .from('purohits')
      .select('id, name');

    if (pErr) {
      throw new InternalServerErrorException(
        `Failed to fetch purohits: ${pErr.message}`,
      );
    }

    // 2️⃣ AVAILABILITY
    const { data: availability, error: aErr } =
      await this.supabase.client
        .from('purohit_availability')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate);

    if (aErr) {
      throw new InternalServerErrorException(
        `Failed to fetch availability: ${aErr.message}`,
      );
    }

    // 3️⃣ BOOKINGS
    const { data: bookings, error: bErr } =
      await this.supabase.client
        .from('bookings')
        .select('purohit_id, date, time_slot')
        .gte('date', startDate)
        .lte('date', endDate);

    if (bErr) {
      throw new InternalServerErrorException(
        `Failed to fetch bookings: ${bErr.message}`,
      );
    }

    // 4️⃣ BOOKING MAP
    const bookingMap: Record<string, Record<string, string[]>> = {};

    (bookings ?? []).forEach(b => {
      bookingMap[b.purohit_id] ??= {};
      bookingMap[b.purohit_id][b.date] ??= [];
      bookingMap[b.purohit_id][b.date].push(b.time_slot);
    });

    // 5️⃣ CALENDAR BUILD
    return (purohits ?? []).map(purohit => {
      const purohitAvailability = (availability ?? []).filter(
        a => a.purohit_id === purohit.id,
      );

      const calendar = purohitAvailability.map(day => {
        const bookedSlots =
          bookingMap[purohit.id]?.[day.date] ?? [];

        const availableSlots = day.time_slots.filter(
          slot => !bookedSlots.includes(slot),
        );

        return {
          date: day.date,
          available: availableSlots.length > 0,
          available_slots: availableSlots,
          booked_slots: bookedSlots,
        };
      });

      return {
        purohit_id: purohit.id,
        purohit_name: purohit.name,
        calendar,
      };
    });
  }
}
