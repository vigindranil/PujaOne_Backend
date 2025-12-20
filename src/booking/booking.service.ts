import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { SupabaseService } from "../supabase/supabase.service";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { UpdateStatusDto } from "./dto/update-status.dto";
import { AssignPurohitDto } from "./dto/assign-purohit.dto";
import { AddAddonDto } from "./dto/add-addon.dto";
import { validateStatusTransition } from "./booking.utils";

@Injectable()
export class BookingService {
  constructor(private readonly supabase: SupabaseService) {}

  // =================================================
  // CREATE BOOKING
  // =================================================
  async create(userId: string, dto: CreateBookingDto) {
    const price = await this.calculateBookingPrice(dto);

    const payment_status =
      dto.payment_mode === "CASH" ? "PAY_ON_SPOT" : "PENDING";

    const status =
      dto.payment_mode === "CASH"
        ? "CONFIRMED"
        : "PENDING_PAYMENT";

    const { data: booking, error } = await this.supabase.client
      .from("bookings")
      .insert({
        user_id: userId,
        puja_id: dto.puja_id,
        pricing_id: dto.pricing_id ?? null,
        date: dto.date,
        time_slot: dto.time_slot,
        address: dto.address,
        address_meta: dto.address_meta ?? null,
        contact_name: dto.contact_name,
        contact_phone: dto.contact_phone,
        contact_email: dto.contact_email,
        samagri_included: dto.samagri_included ?? false,
        samagri_kit_id: dto.samagri_kit_id ?? null,
        payment_mode: dto.payment_mode,
        payment_status,
        status,
        price,
      })
      .select()
      .single();

    if (error || !booking) {
      throw new BadRequestException(error?.message);
    }

    // 🔥 PACKAGE AUTO INSERT
    if (dto.pricing_id) {
      await this.insertPackageItems(booking.id, dto.pricing_id);
    }

    // 🔥 CUSTOM ADDONS (skip package ones)
    if (dto.addons?.length) {
      for (const item of dto.addons) {
        const { data: exists } = await this.supabase.client
          .from("booking_addons")
          .select("id")
          .eq("booking_id", booking.id)
          .eq("addon_id", item.addon_id)
          .maybeSingle();

        if (exists) continue;

        const { data: addon } = await this.supabase.client
          .from("puja_addons")
          .select("price")
          .eq("id", item.addon_id)
          .single();

        if (!addon) {
          throw new BadRequestException(
            `Invalid addon ${item.addon_id}`,
          );
        }

        await this.supabase.client.from("booking_addons").insert({
          booking_id: booking.id,
          addon_id: item.addon_id,
          quantity: item.quantity,
          price: addon.price,
          source: "CUSTOM",
        });
      }
    }

    if (dto.save_address) {
      await this.saveUserAddress(userId, dto);
    }

    return booking;
  }

  // =================================================
  // PRICE CALCULATION (✔ FINAL & CORRECT)
  // =================================================
 async calculateBookingPrice(dto: CreateBookingDto): Promise<number> {
  let total = 0;

  // =========================
  // 🟣 PACKAGE MODE
  // =========================
  if (dto.pricing_id) {
    const { data: pricing, error } = await this.supabase.client
      .from("puja_pricing_options")
      .select("amount")
      .eq("id", dto.pricing_id)
      .single();

    if (error || !pricing) {
      throw new BadRequestException("Invalid package");
    }

    total = Number(pricing.amount);

    // extra addons (not in package)
    const { data: pkgAddons } = await this.supabase.client
      .from("puja_pricing_addons")
      .select("addon_id")
      .eq("pricing_id", dto.pricing_id);

    const included = (pkgAddons ?? []).map(a => a.addon_id);

    for (const item of dto.addons ?? []) {
      if (!included.includes(item.addon_id)) {
        const { data: addon } = await this.supabase.client
          .from("puja_addons")
          .select("price")
          .eq("id", item.addon_id)
          .single();

        if (!addon) throw new BadRequestException("Invalid addon");

        total += Number(addon.price) * Number(item.quantity);
      }
    }
  }

  // =========================
  // 🔵 CUSTOM MODE
  // =========================
  else {
    const { data: puja } = await this.supabase.client
      .from("pujas")
      .select("base_price")
      .eq("id", dto.puja_id)
      .single();

    if (!puja) throw new BadRequestException("Invalid puja");

    total = Number(puja.base_price);

    for (const item of dto.addons ?? []) {
      const { data: addon } = await this.supabase.client
        .from("puja_addons")
        .select("price")
        .eq("id", item.addon_id)
        .single();

      if (!addon) throw new BadRequestException("Invalid addon");

      total += Number(addon.price) * Number(item.quantity);
    }
  }

  // =========================
  // 🟡 SAMAGRI (🔥 MUST ADD)
  // =========================
  if (dto.samagri_included && dto.samagri_kit_id) {
    const { data: kit } = await this.supabase.client
      .from("samagri_kits")
      .select("price")
      .eq("id", dto.samagri_kit_id)
      .single();

    if (!kit) throw new BadRequestException("Invalid samagri kit");

    total += Number(kit.price);
  }

  return total;
}


  // =================================================
  // PACKAGE AUTO INSERT
  // =================================================
  private async insertPackageItems(
    bookingId: string,
    pricingId: string,
  ) {
    // ADDONS
    const { data: addons } = await this.supabase.client
      .from("puja_pricing_addons")
      .select("addon_id")
      .eq("pricing_id", pricingId);

    if (addons?.length) {
      await this.supabase.client
        .from("booking_addons")
        .insert(
          addons.map(a => ({
            booking_id: bookingId,
            addon_id: a.addon_id,
            quantity: 1,
            price: 0,
            source: "PACKAGE",
          })),
        );
    }

    // REQUIREMENTS
    const { data: reqs } = await this.supabase.client
      .from("puja_pricing_requirements")
      .select("requirement_id")
      .eq("pricing_id", pricingId);

    if (reqs?.length) {
      await this.supabase.client
        .from("booking_requirements")
        .insert(
          reqs.map(r => ({
            booking_id: bookingId,
            requirement_id: r.requirement_id,
            source: "PACKAGE",
          })),
        );
    }

    // SAMAGRI FROM PACKAGE (optional override)
    const { data: pkgSamagri } = await this.supabase.client
      .from("puja_pricing_samagri")
      .select("samagri_kit_id")
      .eq("pricing_id", pricingId)
      .maybeSingle();

    if (pkgSamagri?.samagri_kit_id) {
      await this.supabase.client
        .from("bookings")
        .update({
          samagri_kit_id: pkgSamagri.samagri_kit_id,
          samagri_included: true,
        })
        .eq("id", bookingId);
    }
  }

  // =================================================
  // FETCH ALL
  // =================================================
  async findAll() {
    const { data, error } = await this.supabase.client
      .from("bookings")
      .select(`*, users(name), purohits(name)`)
      .order("created_at", { ascending: false });

    if (error) throw new BadRequestException(error.message);
    return data ?? [];
  }

async findAllWithSummary(userId?: string) {
  // =========================
  // 1️⃣ FETCH BOOKINGS
  // =========================
  let query = this.supabase.client
    .from('bookings')
    .select(`
      id,
      date,
      time_slot,
      status,
      payment_status,
      price,
      samagri_included,
      samagri_kit_id,
      users(name)
    `)
    .order('created_at', { ascending: false });

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data: bookings, error } = await query;

  if (error) {
    throw new BadRequestException(error.message);
  }

  if (!bookings || bookings.length === 0) return [];

  const bookingIds = bookings.map(b => b.id);

  // =========================
  // 2️⃣ FETCH ADDONS SUMMARY
  // =========================
  const { data: addons } = await this.supabase.client
    .from('booking_addons')
    .select(`
      booking_id,
      quantity,
      puja_addons (
        title
      )
    `)
    .in('booking_id', bookingIds);

  const addonsMap: Record<string, string[]> = {};

  for (const a of addons ?? []) {
    if (!addonsMap[a.booking_id]) {
      addonsMap[a.booking_id] = [];
    }

    const addonTitle =
      a.puja_addons && a.puja_addons.length > 0
        ? a.puja_addons[0].title
        : 'Addon';

    addonsMap[a.booking_id].push(
      `${addonTitle} x${a.quantity}`,
    );
  }

  // =========================
  // 3️⃣ FETCH SAMAGRI KITS
  // =========================
  const samagriIds = bookings
    .filter(b => b.samagri_kit_id)
    .map(b => b.samagri_kit_id);

  const samagriMap: Record<string, string> = {};

  if (samagriIds.length > 0) {
    const { data: kits } = await this.supabase.client
      .from('samagri_kits')
      .select('id, name, price')
      .in('id', samagriIds);

    for (const k of kits ?? []) {
      samagriMap[k.id] = `${k.name} (₹${k.price})`;
    }
  }

  // =========================
  // 4️⃣ FINAL RESPONSE
  // =========================
  return bookings.map(b => ({
    ...b,
    addons_summary: addonsMap[b.id]?.join(', ') ?? null,
    samagri_summary:
      b.samagri_included && b.samagri_kit_id
        ? samagriMap[b.samagri_kit_id] ?? null
        : null,
  }));
}



  // =================================================
  // FETCH ONE (FULL DETAILS)
  // =================================================
  async findOne(id: string) {
    const { data: booking } = await this.supabase.client
      .from("bookings")
      .select(`*, users(*), purohits(*)`)
      .eq("id", id)
      .single();

    if (!booking) throw new NotFoundException("Booking not found");

    const { data: addons } = await this.supabase.client
      .from("booking_addons")
      .select(`*, puja_addons(*)`)
      .eq("booking_id", id);

    const { data: requirements } = await this.supabase.client
      .from("booking_requirements")
      .select(`*, puja_requirements(*)`)
      .eq("booking_id", id);

    let samagri_kit = null;
    if (booking.samagri_included && booking.samagri_kit_id) {
      const { data } = await this.supabase.client
        .from("samagri_kits")
        .select("*")
        .eq("id", booking.samagri_kit_id)
        .single();
      samagri_kit = data;
    }
   const price_breakup = await this.getPriceBreakup(id);
    return {
      ...booking,
      booking_addons: addons ?? [],
      booking_requirements: requirements ?? [],
      samagri_kit,
      price_breakup
    };
  }

  // =================================================
  // OTHER METHODS (UNCHANGED)
  // =================================================
  async assignPurohit(id: string, dto: AssignPurohitDto) {
    const { data } = await this.supabase.client
      .from("bookings")
      .update({ purohit_id: dto.purohit_id })
      .eq("id", id)
      .select()
      .single();
    return data;
  }

  async updateStatus(id: string, dto: UpdateStatusDto, userId: string) {
    const old = await this.findOne(id);
    validateStatusTransition(old.status, dto.status);

    const { data } = await this.supabase.client
      .from("bookings")
      .update({ status: dto.status })
      .eq("id", id)
      .select()
      .single();

    await this.supabase.client.from("booking_status_history").insert({
      booking_id: id,
      from_status: old.status,
      to_status: dto.status,
      changed_by: userId,
    });

    return data;
  }

  async addAddon(id: string, dto: AddAddonDto) {
    const booking = await this.findOne(id);

    if (
      booking.status === "CANCELLED" ||
      booking.status === "COMPLETED"
    ) {
      throw new BadRequestException("Cannot modify booking");
    }

    const { data: addon } = await this.supabase.client
      .from("puja_addons")
      .select("price")
      .eq("id", dto.addon_id)
      .single();

    if (!addon) throw new BadRequestException("Invalid addon");

    return this.supabase.client
      .from("booking_addons")
      .insert({
        booking_id: id,
        addon_id: dto.addon_id,
        quantity: dto.quantity,
        price: addon.price,
        source: "CUSTOM",
      })
      .select()
      .single();
  }

  async requestCancellation(bookingId: string, reason?: string) {
  const booking = await this.findOne(bookingId);

  if (booking.status === 'COMPLETED') {
    throw new BadRequestException(
      'Completed booking cannot be cancelled',
    );
  }

  // unpaid → direct cancel
  if (booking.payment_status !== 'PAID') {
    await this.supabase.client
      .from('bookings')
      .update({
        status: 'CANCELLED',
        payment_status: 'FAILED',
      })
      .eq('id', bookingId);

    // 🔥 optional: log reason
    if (reason) {
      await this.supabase.client
        .from('booking_cancellation_logs')
        .insert({
          booking_id: bookingId,
          reason,
        });
    }

    return { message: 'Booking cancelled successfully' };
  }

  // paid → refund flow
  await this.supabase.client
    .from('bookings')
    .update({
      status: 'CANCEL_REQUESTED',
      payment_status: 'REFUND_PENDING',
    })
    .eq('id', bookingId);

  if (reason) {
    await this.supabase.client
      .from('booking_cancellation_logs')
      .insert({
        booking_id: bookingId,
        reason,
      });
  }

  return {
    message: 'Cancellation requested. Refund processing started.',
  };
}


  private async saveUserAddress(userId: string, dto: CreateBookingDto) {
    await this.supabase.client.from("user_addresses").insert({
      user_id: userId,
      label: dto.address_label ?? "Saved Address",
      address: dto.address,
    });
  }

  async getPriceBreakup(bookingId: string) {
  // =========================
  // 1️⃣ FETCH BOOKING
  // =========================
  const { data: booking, error } = await this.supabase.client
    .from('bookings')
    .select(`
      id,
      puja_id,
      pricing_id,
      samagri_included,
      samagri_kit_id
    `)
    .eq('id', bookingId)
    .single();

  if (error || !booking) {
    throw new NotFoundException('Booking not found');
  }

  let basePrice = 0;
  let addonsTotal = 0;
  let samagriPrice = 0;

  // =========================
  // 2️⃣ BASE PRICE
  // =========================
  if (booking.pricing_id) {
    // 🟣 PACKAGE BASE PRICE
    const { data: pkg } = await this.supabase.client
      .from('puja_pricing_options')
      .select('amount')
      .eq('id', booking.pricing_id)
      .single();

    if (!pkg) throw new BadRequestException('Invalid package');

    basePrice = Number(pkg.amount);
  } else {
    // 🔵 CUSTOM BASE PRICE
    const { data: puja } = await this.supabase.client
      .from('pujas')
      .select('base_price')
      .eq('id', booking.puja_id)
      .single();

    if (!puja) throw new BadRequestException('Invalid puja');

    basePrice = Number(puja.base_price);
  }

  // =========================
  // 3️⃣ ADDONS TOTAL (ONLY CUSTOM)
  // =========================
  const { data: addons } = await this.supabase.client
    .from('booking_addons')
    .select('price, quantity, source')
    .eq('booking_id', bookingId)
    .eq('source', 'CUSTOM');

  for (const a of addons ?? []) {
    addonsTotal += Number(a.price) * Number(a.quantity);
  }

  // =========================
  // 4️⃣ SAMAGRI PRICE
  // =========================
  if (booking.samagri_included && booking.samagri_kit_id) {
    const { data: kit } = await this.supabase.client
      .from('samagri_kits')
      .select('price')
      .eq('id', booking.samagri_kit_id)
      .single();

    if (!kit) throw new BadRequestException('Invalid samagri kit');

    samagriPrice = Number(kit.price);
  }

  // =========================
  // 5️⃣ FINAL BREAKUP
  // =========================
  return {
    base_price: basePrice,
    addons_total: addonsTotal,
    samagri_price: samagriPrice,
    grand_total: basePrice + addonsTotal + samagriPrice,
  };
}

}
