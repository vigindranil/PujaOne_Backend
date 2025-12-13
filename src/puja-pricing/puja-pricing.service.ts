import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreatePricingOptionDto } from './dto/create-pricing.dto';
import { UpdatePricingOptionDto } from './dto/update-pricing.dto';

@Injectable()
export class PujaPricingService {
  constructor(private supabase: SupabaseService) {}

  async create(puja_id: string, dto: CreatePricingOptionDto) {
    const { data, error } = await this.supabase.client
      .from('puja_pricing_options')
      .insert({ puja_id, ...dto })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async findAll(puja_id: string) {
    const { data, error } = await this.supabase.client
      .from('puja_pricing_options')
      .select('*')
      .eq('puja_id', puja_id)
      .order('sort_order');

    if (error) throw error;
    return data;
  }

  async update(id: string, dto: UpdatePricingOptionDto) {
    const { data, error } = await this.supabase.client
      .from('puja_pricing_options')
      .update({ ...dto, updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) throw new NotFoundException("Pricing option not found");
    return data;
  }

  async remove(id: string) {
    const { error } = await this.supabase.client
      .from('puja_pricing_options')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { message: "Pricing option deleted" };
  }
  async getAdminCalendar(month: number, year: number) {
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = `${year}-${String(month).padStart(2, '0')}-31`;

  // 1️⃣ Get all purohits
  const { data: purohits, error: pErr } = await this.supabase.client
    .from('purohits')
    .select('id, name');

  if (pErr) throw pErr;

  // 2️⃣ Get availability
  const { data: availability } = await this.supabase.client
    .from('purohit_availability')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate);

  // 3️⃣ Get bookings
  const { data: bookings } = await this.supabase.client
    .from('bookings')
    .select('purohit_id, date, time_slot')
    .gte('date', startDate)
    .lte('date', endDate);

  // 4️⃣ Build booking map
  const bookingMap: Record<string, Record<string, string[]>> = {};
  (bookings ?? []).forEach(b => {
    if (!bookingMap[b.purohit_id]) bookingMap[b.purohit_id] = {};
    if (!bookingMap[b.purohit_id][b.date])
      bookingMap[b.purohit_id][b.date] = [];
    bookingMap[b.purohit_id][b.date].push(b.time_slot);
  });

  // 5️⃣ Build admin calendar
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
