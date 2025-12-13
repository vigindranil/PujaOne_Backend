import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class PurohitAvailabilityService {
  constructor(private supabase: SupabaseService) {}

  // =========================
  // PUROHIT ADD / UPDATE AVAILABILITY
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
      .maybeSingle();

    if (error) {
      throw new BadRequestException(
        `Failed to add availability: ${error.message}`,
      );
    }

    if (!data) {
      throw new InternalServerErrorException(
        'Availability saved but no data returned',
      );
    }

    return data;
  }

  // =========================
  // PUROHIT BLOCK DATE
  // =========================
  async blockDate(purohit_id: string, dto: any) {
    const { error } = await this.supabase.client
      .from('purohit_availability')
      .upsert(
        {
          purohit_id,
          date: dto.date,
          time_slots: [],
        },
        { onConflict: 'purohit_id,date' },
      );

    if (error) {
      throw new BadRequestException(
        `Failed to block date: ${error.message}`,
      );
    }

    return { message: 'Date blocked successfully' };
  }

  // =========================
  // PUBLIC CHECK AVAILABILITY
  // =========================
  async checkAvailability(purohit_id: string, dto: any) {
    const { data, error } = await this.supabase.client
      .from('purohit_availability')
      .select('time_slots')
      .eq('purohit_id', purohit_id)
      .eq('date', dto.date)
      .maybeSingle();

    if (error) {
      throw new BadRequestException(
        `Failed to check availability: ${error.message}`,
      );
    }

    const available =
      !!data && data.time_slots?.includes(dto.time_slot);

    return {
      available,
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

    const { data: availability, error: aErr } =
      await this.supabase.client
        .from('purohit_availability')
        .select('*')
        .eq('purohit_id', purohit_id)
        .gte('date', start)
        .lte('date', end);

    if (aErr) {
      throw new BadRequestException(
        `Failed to load availability: ${aErr.message}`,
      );
    }

    const { data: bookings, error: bErr } =
      await this.supabase.client
        .from('bookings')
        .select('date, time_slot')
        .eq('purohit_id', purohit_id)
        .gte('date', start)
        .lte('date', end);

    if (bErr) {
      throw new BadRequestException(
        `Failed to load bookings: ${bErr.message}`,
      );
    }

    const bookingMap: Record<string, string[]> = {};
    (bookings ?? []).forEach(b => {
      if (!bookingMap[b.date]) bookingMap[b.date] = [];
      bookingMap[b.date].push(b.time_slot);
    });

    return (availability ?? []).map(day => {
      const bookedSlots = bookingMap[day.date] ?? [];
      const availableSlots = (day.time_slots ?? []).filter(
        slot => !bookedSlots.includes(slot),
      );

      return {
        date: day.date,
        available: availableSlots.length > 0,
        available_slots: availableSlots,
        booked_slots: bookedSlots,
      };
    });
  }

  // =========================
  // ADMIN CALENDAR (ALL PUROHITS)
  // =========================
  async getAdminCalendar(month: number, year: number) {
    const start = `${year}-${String(month).padStart(2, '0')}-01`;
    const end = `${year}-${String(month).padStart(2, '0')}-31`;

    const { data, error } = await this.supabase.client
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

    if (error) {
      throw new BadRequestException(
        `Failed to load admin calendar: ${error.message}`,
      );
    }

    return data ?? [];
  }
}
