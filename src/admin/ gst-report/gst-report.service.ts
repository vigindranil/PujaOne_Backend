import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';

export interface GstReportRow {
  booking_id: string;
  invoice_number: string;
  invoice_date: string;

  puja_amount: number;
  samagri_amount: number;

  taxable_puja: number;
  taxable_samagri: number;

  cgst_puja: number;
  sgst_puja: number;

  cgst_samagri: number;
  sgst_samagri: number;

  total_tax: number;
  grand_total: number;
}

@Injectable()
export class GstReportService {
  constructor(private readonly supabase: SupabaseService) {}

  /**
   * Monthly GST Report
   * @param year 2025
   * @param month 1-12
   */
  async getMonthlyReport(
    year: number,
    month: number,
  ): Promise<GstReportRow[]> {

    const start = new Date(year, month - 1, 1).toISOString();
    const end = new Date(year, month, 0, 23, 59, 59).toISOString();

    // =========================
    // 1️⃣ FETCH INVOICES
    // =========================
    const { data: invoices, error } = await this.supabase.client
      .from('booking_invoices')
      .select(`
        booking_id,
        invoice_number,
        generated_at,
        total_amount,
        bookings (
          pricing_id,
          puja_id,
          samagri_included,
          samagri_kit_id
        )
      `)
      .gte('generated_at', start)
      .lte('generated_at', end);

    if (error) {
      throw new BadRequestException(error.message);
    }

    if (!invoices?.length) return [];

    const report: GstReportRow[] = [];

    // =========================
    // 2️⃣ PROCESS EACH INVOICE
    // =========================
    for (const inv of invoices) {

      const booking = Array.isArray(inv.bookings)
        ? inv.bookings[0]
        : inv.bookings;

      if (!booking) continue;

      let pujaAmount = 0;
      let samagriAmount = 0;

      // 🔵 PUJA / PACKAGE AMOUNT
      if (booking.pricing_id) {
        const { data: pkg } = await this.supabase.client
          .from('puja_pricing_options')
          .select('amount')
          .eq('id', booking.pricing_id)
          .maybeSingle();

        pujaAmount = Number(pkg?.amount ?? 0);
      } else {
        const { data: puja } = await this.supabase.client
          .from('pujas')
          .select('base_price')
          .eq('id', booking.puja_id)
          .maybeSingle();

        pujaAmount = Number(puja?.base_price ?? 0);
      }

      // 🟡 SAMAGRI AMOUNT
      if (booking.samagri_included && booking.samagri_kit_id) {
        const { data: kit } = await this.supabase.client
          .from('samagri_kits')
          .select('price')
          .eq('id', booking.samagri_kit_id)
          .maybeSingle();

        samagriAmount = Number(kit?.price ?? 0);
      }

      // =========================
      // 3️⃣ GST LOGIC
      // =========================
      // Assumption:
      // Puja GST = 18% (9% CGST + 9% SGST)
      // Samagri GST = 12% (6% CGST + 6% SGST)

      const taxablePuja = pujaAmount;
      const taxableSamagri = samagriAmount;

      const cgstPuja = +(taxablePuja * 0.09).toFixed(2);
      const sgstPuja = +(taxablePuja * 0.09).toFixed(2);

      const cgstSamagri = +(taxableSamagri * 0.06).toFixed(2);
      const sgstSamagri = +(taxableSamagri * 0.06).toFixed(2);

      const totalTax =
        cgstPuja +
        sgstPuja +
        cgstSamagri +
        sgstSamagri;

      const grandTotal =
        taxablePuja +
        taxableSamagri +
        totalTax;

      // =========================
      // 4️⃣ PUSH ROW
      // =========================
      report.push({
        booking_id: inv.booking_id,
        invoice_number: inv.invoice_number,
        invoice_date: inv.generated_at,

        puja_amount: pujaAmount,
        samagri_amount: samagriAmount,

        taxable_puja: taxablePuja,
        taxable_samagri: taxableSamagri,

        cgst_puja: cgstPuja,
        sgst_puja: sgstPuja,

        cgst_samagri: cgstSamagri,
        sgst_samagri: sgstSamagri,

        total_tax: totalTax,
        grand_total: grandTotal,
      });
    }

    return report;
  }
}
