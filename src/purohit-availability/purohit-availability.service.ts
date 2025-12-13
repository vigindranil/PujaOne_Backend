import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class PurohitAvailabilityService {
  constructor(private supabase: SupabaseService) {}

  // =========================
  // PUROHIT ADD AVAILABILITY
  // =========================
  async addAvailability(purohit_id: string, dto: any) {
    const { data, error } = await this.supabase.client
      .from('purohit_availability')
      .upsert(
        {
          purohit_id,
          date: dto.date,
          time_slots: dto.time_slots,
        },
        { onConflict: 'purohit_id,date' },
      )
      .select()
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  // =========================
  // PUROHIT BLOCK DATE
  // =========================
  async blockDate(purohit_id: string, dto: any) {
    const { data, error } = await this.supabase.client
      .from('purohit_availability')
      .upsert(
        {
          purohit_id,
          date: dto.date,
          time_slots: [],
        },
        { onConflict: 'purohit_id,date' },
      )
      .select()
      .single();

    if (error) throw new BadRequestException(error.message);
    return { message: 'Date blocked successfully' };
  }

  // =========================
  // PUBLIC CHECK AVAILABILITY
  // =========================
  async checkAvailability(purohit_id: string, dto: any) {
    const { data, error } = await this.supabase.client
      .from('purohit_availability')
      .select('*')
      .eq('purohit_id', purohit_id)
      .eq('date', dto.date)
      .maybeSingle();

    if (error) throw new BadRequestException(error.message);

    const available =
      data && data.time_slots?.includes(dto.time_slot);

    return {
      available: !!available,
    };
  }

  // =========================
  // PUROHIT MONTH CALENDAR
  // =========================
  async getPurohitCalendar(
    purohit_id: string,
    month: number,
    year: number,
  ) {
    const start = `${year}-${String(month).padStart(2, '0')}-01`;
    const end = `${year}-${String(month).padStart(2, '0')}-31`;

    const { data: availability } = await this.supabase.client
      .from('purohit_availability')
      .select('*')
      .eq('purohit_id', purohit_id)
      .gte('date', start)
      .lte('date', end);

    const { data: bookings } = await this.supabase.client
      .from('bookings')
      .select('date, time_slot')
      .eq('purohit_id', purohit_id)
      .gte('date', start)
      .lte('date', end);

    const bookingMap: Record<string, string[]> = {};
    bookings?.forEach(b => {
      if (!bookingMap[b.date]) bookingMap[b.date] = [];
      bookingMap[b.date].push(b.time_slot);
    });

    return (availability ?? []).map(day => {
      const bookedSlots = bookingMap[day.date] || [];
      const availableSlots = day.time_slots.filter(
        s => !bookedSlots.includes(s),
      );

      return {
        date: day.date,
        available_slots: availableSlots,
        booked_slots: bookedSlots,
        available: availableSlots.length > 0,
      };
    });
  }

  // =========================
  // ADMIN CALENDAR (ALL)
  // =========================
  async getAdminCalendar(month: number, year: number) {
    const start = `${year}-${String(month).padStart(2, '0')}-01`;
    const end = `${year}-${String(month).padStart(2, '0')}-31`;

    const { data: availability } = await this.supabase.client
      .from('purohit_availability')
      .select(
        `
        date,
        time_slots,
        purohits (
          id,
          name
        )
      `,
      )
      .gte('date', start)
      .lte('date', end);

    return availability ?? [];
  }
}
