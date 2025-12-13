import { Injectable, BadRequestException } from "@nestjs/common";
import { SupabaseService } from "../supabase/supabase.service";
import { AddAvailabilityDto } from "./dto/add-availability.dto";
import { BlockDateDto } from "./dto/block-date.dto";
import { CheckAvailabilityDto } from "./dto/check-availability.dto";

@Injectable()
export class PurohitAvailabilityService {
  constructor(private supabase: SupabaseService) {}

  // ⭐ Add available slots
  async addAvailability(purohit_id: string, dto: AddAvailabilityDto) {
    const { data, error } = await this.supabase.client
      .from("purohit_availability")
      .insert({
        purohit_id,
        date: dto.date,
        time_slots: dto.time_slots,
      })
      .select()
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  // ⭐ Block date (leave, travel, sick)
  async blockDate(purohit_id: string, dto: BlockDateDto) {
    const { data, error } = await this.supabase.client
      .from("purohit_blocked_dates")
      .insert({
        purohit_id,
        date: dto.date,
        reason: dto.reason,
      })
      .select()
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  // ⭐ Check availability for a date + time
  async check(dto: CheckAvailabilityDto) {
    const { date, time_slot } = dto;

    // 1️⃣ Check if Purohit blocked the date
    const blocked = await this.supabase.client
      .from("purohit_blocked_dates")
      .select("*")
      .eq("date", date);

    if (blocked.data?.length) {
      return {
        available: false,
        reason: "Purohit blocked this date",
      };
    }

    // 2️⃣ Check booking already exists
    const booking = await this.supabase.client
      .from("bookings")
      .select("*")
      .eq("date", date)
      .eq("time_slot", time_slot);

    if (booking.data?.length) {
      return {
        available: false,
        reason: "Already booked",
      };
    }

    // 3️⃣ Check Purohit availability table
    const availability = await this.supabase.client
      .from("purohit_availability")
      .select("*")
      .eq("date", date);

    const isAvailable =
      availability.data?.some((a) => a.time_slots.includes(time_slot)) || false;

    return {
      available: isAvailable,
      reason: isAvailable ? "Available" : "Not available",
    };
  }
}
