import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { SupabaseService } from "../supabase/supabase.service";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { UpdateStatusDto } from "./dto/update-status.dto";
import { AssignPurohitDto } from "./dto/assign-purohit.dto";
import { AddAddonDto } from "./dto/add-addon.dto";
import { CalculatePriceDto } from "./dto/calculate-price.dto";
import { validateStatusTransition } from "./booking.utils";

@Injectable()
export class BookingService {
  constructor(private supabase: SupabaseService) {}

  // =========================
  // CREATE BOOKING
  // =========================
  async create(userId: string, dto: CreateBookingDto) {
    // 🔥 PRICE CALCULATION
    const price = await this.calculatePrice({
      puja_type_id: dto.puja_type_id,
      addons: dto.addons ?? [],
      samagri_price: dto.samagri_included ? dto.price ?? 0 : 0,
    });

    // 🔥 STATUS & PAYMENT MODE
    const payment_status =
      dto.payment_mode === "CASH" ? "PAY_ON_SPOT" : "PENDING";

    const status =
      dto.payment_mode === "CASH"
        ? "CONFIRMED"
        : "PENDING_PAYMENT";

    const { data, error } = await this.supabase.client
      .from("bookings")
      .insert({
        user_id: userId,
        puja_type_id: dto.puja_type_id,
        date: dto.date,
        time_slot: dto.time_slot,
        address: dto.address,
        address_meta: dto.address_meta ?? null,
        samagri_included: dto.samagri_included ?? false,
        samagri_kit_id: dto.samagri_kit_id ?? null,
        status,
        payment_status,
        price,
      })
      .select()
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  // =========================
  // ADMIN: LIST ALL BOOKINGS
  // =========================
  async findAll() {
    const { data, error } = await this.supabase.client
      .from("bookings")
      .select("*, purohits(name), users(name)");

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  // =========================
  // GET ONE BOOKING
  // =========================
  async findOne(id: string) {
    const { data, error } = await this.supabase.client
      .from("bookings")
      .select("*, purohits(*), users(*), booking_addons(*)")
      .eq("id", id)
      .single();

    if (error || !data)
      throw new NotFoundException("Booking not found");

    return data;
  }

  // =========================
  // UPDATE BOOKING STATUS
  // =========================
  async updateStatus(id: string, dto: UpdateStatusDto, userId: string) {
    const old = await this.findOne(id);

    // 🔒 VALIDATE STATUS FLOW
    validateStatusTransition(old.status, dto.status);

    const { data, error } = await this.supabase.client
      .from("bookings")
      .update({ status: dto.status })
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw new BadRequestException(error.message);

    // 🔥 STATUS HISTORY
    await this.supabase.client
      .from("booking_status_history")
      .insert({
        booking_id: id,
        from_status: old.status,
        to_status: dto.status,
        changed_by: userId,
      });

    return data;
  }

  // =========================
  // ASSIGN PUROHIT
  // =========================
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

  // =========================
  // ADD ADDON TO BOOKING
  // =========================
  async addAddon(id: string, dto: AddAddonDto) {
    const booking = await this.findOne(id);

    if (
      booking.status === "CANCELLED" ||
      booking.status === "COMPLETED"
    ) {
      throw new BadRequestException(
        "Cannot modify this booking",
      );
    }

    // ❌ Prevent duplicate addon
    const { data: exists } = await this.supabase.client
      .from("booking_addons")
      .select("id")
      .eq("booking_id", id)
      .eq("addon_id", dto.addon_id)
      .maybeSingle();

    if (exists) {
      throw new BadRequestException(
        "Addon already added to booking",
      );
    }

    const { data: addon, error } = await this.supabase.client
      .from("puja_addons")
      .select("price")
      .eq("id", dto.addon_id)
      .single();

    if (error || !addon)
      throw new BadRequestException("Addon not found");

    const { data, error: insErr } = await this.supabase.client
      .from("booking_addons")
      .insert({
        booking_id: id,
        addon_id: dto.addon_id,
        quantity: dto.quantity,
        price: addon.price,
      })
      .select("*")
      .single();

    if (insErr) throw new BadRequestException(insErr.message);
    return data;
  }

  // =========================
  // PRICE CALCULATION (CORE)
  // =========================
  async calculatePrice(dto: CalculatePriceDto): Promise<number> {
    const { data: puja, error } = await this.supabase.client
      .from("puja_types")
      .select("base_price")
      .eq("id", dto.puja_type_id)
      .single();

    if (error || !puja)
      throw new BadRequestException("Invalid puja type");

    let total = Number(puja.base_price);

    for (const item of dto.addons ?? []) {
      const { data: addon, error: addonErr } =
        await this.supabase.client
          .from("puja_addons")
          .select("price")
          .eq("id", item.addon_id)
          .single();

      if (addonErr || !addon)
        throw new BadRequestException(
          `Invalid addon: ${item.addon_id}`,
        );

      total += Number(addon.price) * Number(item.quantity);
    }

    if (dto.samagri_price && dto.samagri_price > 0) {
      total += Number(dto.samagri_price);
    }

    return total;
  }

  // =========================
  // INTERNAL STATUS UPDATE
  // =========================
  async updateStatusInternal(
    bookingId: string,
    status: string,
    paymentStatus?: string,
  ) {
    const updateData: any = { status };
    if (paymentStatus)
      updateData.payment_status = paymentStatus;

    const { data, error } = await this.supabase.client
      .from("bookings")
      .update(updateData)
      .eq("id", bookingId)
      .select("*")
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  // =========================
  // CANCELLATION FLOW
  // =========================
  async requestCancellation(bookingId: string, reason?: string) {
    const booking = await this.findOne(bookingId);

    if (booking.status === "COMPLETED") {
      throw new BadRequestException(
        "Completed booking cannot be cancelled",
      );
    }

    // ❌ Not paid → cancel immediately
    if (booking.payment_status !== "PAID") {
      await this.updateStatusInternal(
        bookingId,
        "CANCELLED",
        "FAILED",
      );
      return { message: "Booking cancelled (no payment)" };
    }

    // 💰 Paid → refund flow
    await this.supabase.client
      .from("bookings")
      .update({
        status: "CANCEL_REQUESTED",
        payment_status: "REFUND_PENDING",
      })
      .eq("id", bookingId);

    return {
      message: "Cancellation requested. Refund processing.",
    };
  }
}
