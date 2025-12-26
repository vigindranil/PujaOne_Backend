import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';

@Injectable()
export class DashboardService {
  constructor(private readonly supabase: SupabaseService) {}

  // ===============================
  // 1️⃣ SUMMARY CARDS
  // ===============================
  async getSummary() {
    const [
      pujas,
      purohits,
      users,
      bookings,
      todayBookings,
    ] = await Promise.all([
      this.supabase.client.from('pujas').select('id', { count: 'exact' }),
      this.supabase.client.from('purohits').select('id', { count: 'exact' }),
      this.supabase.client.from('users').select('id', { count: 'exact' }),
      this.supabase.client.from('bookings').select('id', { count: 'exact' }),
      this.supabase.client
        .from('bookings')
        .select('id', { count: 'exact' })
        .eq('date', new Date().toISOString().split('T')[0]),
    ]);

    return {
      total_pujas: pujas.count ?? 0,
      total_purohits: purohits.count ?? 0,
      total_users: users.count ?? 0,
      total_bookings: bookings.count ?? 0,
      today_bookings: todayBookings.count ?? 0,
    };
  }

  // ===============================
  // 2️⃣ MONTHLY BOOKINGS CHART
  // ===============================
  async getMonthlyBookings() {
    const { data } = await this.supabase.client.rpc(
      'monthly_booking_stats',
    );

    return data ?? [];
  }

  // ===============================
  // 3️⃣ MONTHLY REVENUE CHART
  // ===============================
  async getMonthlyRevenue() {
    const { data } = await this.supabase.client.rpc(
      'monthly_revenue_stats',
    );

    return data ?? [];
  }

  // ===============================
  // 4️⃣ TODAY PUJA ALERTS
  // ===============================
  async getTodayPujaAlerts() {
    const today = new Date().toISOString().split('T')[0];

    const { data } = await this.supabase.client
      .from('bookings')
      .select(`
        id,
        date,
        time_slot,
        status,
        users(name, phone),
        purohits(name, phone),
        pujas(title)
      `)
      .eq('date', today)
      .eq('status', 'CONFIRMED');

    return data ?? [];
  }

  // ===============================
  // 5️⃣ PENDING ALERTS
  // ===============================
  async getPendingAlerts() {
    const { data } = await this.supabase.client
      .from('bookings')
      .select(`
        id,
        date,
        payment_status,
        purohit_id,
        users(name, phone),
        pujas(title)
      `)
      .or('payment_status.eq.PENDING,purohit_id.is.null');

    return data ?? [];
  }

  // ===============================
  // 6️⃣ PUROHIT PERFORMANCE
  // ===============================
  async getPurohitPerformance() {
    const { data } = await this.supabase.client
      .from('purohits')
      .select(`
        id,
        name,
        rating_avg,
        completed_count,
        bookings:bookings(count)
      `)
      .order('completed_count', { ascending: false })
      .limit(10);

    return data ?? [];
  }

  // ===============================
  // 7️⃣ PUJA PERFORMANCE
  // ===============================
  async getPujaPerformance() {
    const { data } = await this.supabase.client
      .from('pujas')
      .select(`
        id,
        title,
        bookings:bookings(count)
      `)
      .order('bookings.count', { ascending: false })
      .limit(10);

    return data ?? [];
  }

  // ===============================
  // 8️⃣ FINANCE SUMMARY
  // ===============================
  async getFinanceSummary() {
    const { data: payments } = await this.supabase.client
      .from('booking_payments')
      .select('amount')
      .eq('status', 'SUCCESS');

    const totalRevenue =
      payments?.reduce((sum, p) => sum + Number(p.amount), 0) ?? 0;

    return {
      total_revenue: totalRevenue,
      currency: 'INR',
    };
  }
  // ===============================
  // 9️⃣ INVENTORY SUMMARY
  // ===============================
  async getInventorySummary() {
  const client = this.supabase.client;

  const [
    pujas,
    activePujas,
    purohits,
    verifiedPurohits,
    unverifiedPurohits,
    samagriKits,
    addons,
    zeroPriceAddons,
  ] = await Promise.all([
    client.from('pujas').select('id', { count: 'exact' }),
    client.from('pujas').select('id', { count: 'exact' }).eq('is_active', true),

    client.from('purohits').select('id', { count: 'exact' }),
    client.from('purohits').select('id', { count: 'exact' }).eq('verified', true),
    client.from('purohits').select('id', { count: 'exact' }).eq('verified', false),

    client.from('samagri_kits').select('id', { count: 'exact' }),

    client.from('puja_addons').select('id', { count: 'exact' }),
    client.from('puja_addons').select('id', { count: 'exact' }).eq('price', 0),
  ]);

  return {
    pujas: {
      total: pujas.count ?? 0,
      active: activePujas.count ?? 0,
    },
    purohits: {
      total: purohits.count ?? 0,
      verified: verifiedPurohits.count ?? 0,
      unverified: unverifiedPurohits.count ?? 0,
    },
    samagri: {
      kits: samagriKits.count ?? 0,
    },
    addons: {
      total: addons.count ?? 0,
      zero_price: zeroPriceAddons.count ?? 0,
    },
  };
  }
  // ===============================
  // 10️⃣ INVENTORY ALERTS
  // ===============================
  async getInventoryAlerts() {
  const client = this.supabase.client;

  const [
    pujaNoPricing,
    unverifiedPurohits,
    zeroPriceAddons,
  ] = await Promise.all([
    client
      .from('pujas')
      .select('id, title')
      .not('id', 'in', (
        client.from('puja_pricing_options').select('puja_id')
      )),

    client
      .from('purohits')
      .select('id, name')
      .eq('verified', false),

    client
      .from('puja_addons')
      .select('id, title')
      .eq('price', 0),
  ]);

  return [
    {
      type: 'PUJA_NO_PRICING',
      count: pujaNoPricing.data?.length ?? 0,
    },
    {
      type: 'PUROHIT_UNVERIFIED',
      count: unverifiedPurohits.data?.length ?? 0,
    },
    {
      type: 'ADDON_ZERO_PRICE',
      count: zeroPriceAddons.data?.length ?? 0,
    },
  ];
  }


}
