import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { SupabaseService } from "../supabase/supabase.service";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { UpdateStatusDto } from "./dto/update-status.dto";
import { AssignPurohitDto } from "./dto/assign-purohit.dto";
import { AddAddonDto } from "./dto/add-addon.dto";
import { CalculatePriceDto } from "./dto/calculate-price.dto";

@Injectable()
export class BookingService {
  constructor(private supabase: SupabaseService) {}

  // 🔥 CREATE BOOKING
  async create(dto: CreateBookingDto) {
    const { data, error } = await this.supabase.client
      .from("bookings")
      .insert(dto)
      .select("*")
      .single();

    if (error) throw new BadRequestException(error.message);

    return { message: "Booking created", data };
  }

  // 🔥 LIST ALL BOOKINGS (ADMIN)
  async findAll() {
    const { data, error } = await this.supabase.client
      .from("bookings")
      .select("*, purohits(name), users(name)");

    if (error) throw new BadRequestException(error.message);

    return data;
  }

  // 🔥 GET ONE BOOKING
  async findOne(id: string) {
    const { data, error } = await this.supabase.client
      .from("bookings")
      .select("*, purohits(*), users(*), booking_addons(*)")
      .eq("id", id)
      .single();

    if (error) throw new NotFoundException("Booking not found");

    return data;
  }

  // 🔥 UPDATE STATUS + INSERT STATUS HISTORY
  async updateStatus(id: string, dto: UpdateStatusDto, userId: string) {
    const old = await this.findOne(id);

    const { data, error } = await this.supabase.client
      .from("bookings")
      .update({ status: dto.status })
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw new BadRequestException(error.message);

    // Insert into history
    await this.supabase.client.from("booking_status_history").insert({
      booking_id: id,
      from_status: old.status,
      to_status: dto.status,
      changed_by: userId,
    });

    return data;
  }

  // 🔥 ASSIGN PUROHIT
  async assignPurohit(id: string, dto: AssignPurohitDto) {
    const { data, error } = await this.supabase.client
      .from("bookings")
      .update({ purohit_id: dto.purohit_id })
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw new BadRequestException(error.message);

    return data;
  }

  // 🔥 ADD ADDON ITEMS
  async addAddon(id: string, dto: AddAddonDto) {
    const { data: addon, error: addErr } = await this.supabase.client
      .from("puja_addons")
      .select("*")
      .eq("id", dto.addon_id)
      .single();

    if (addErr) throw new BadRequestException("Addon not found");

    const { data, error } = await this.supabase.client
      .from("booking_addons")
      .insert({
        booking_id: id,
        addon_id: dto.addon_id,
        quantity: dto.quantity,
        price: addon.price,
      })
      .select("*")
      .single();

    if (error) throw new BadRequestException(error.message);

    return data;
  }
async calculatePrice(dto: CalculatePriceDto) {
  // 1️⃣ Fetch puja base price
  const { data: puja, error: pujaErr } = await this.supabase.client
    .from("puja_types")
    .select("base_price")
    .eq("id", dto.puja_type_id)
    .single();

  if (pujaErr || !puja) {
    throw new BadRequestException("Invalid puja type selected");
  }

  let total = Number(puja.base_price);

  // 2️⃣ Loop through addons safely
  for (const item of dto.addons) {
    const { data: addon, error: addonErr } = await this.supabase.client
      .from("puja_addons")
      .select("price")
      .eq("id", item.addon_id)
      .single();

    if (addonErr || !addon) {
      throw new BadRequestException(
        `Invalid addon selected → ${item.addon_id}`
      );
    }

    total += Number(addon.price) * Number(item.quantity);
  }

  return { total_price: total };
}


}
