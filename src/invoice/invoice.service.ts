import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { EmailService } from '../email/email.service';
import { generateInvoiceNumber } from './invoice.utils';
import { invoiceHtmlTemplate } from './invoice.template';
import QRCode from 'qrcode';
import puppeteer from 'puppeteer';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly supabase: SupabaseService,
    private readonly emailService: EmailService,
  ) {}

  async generateInvoice(bookingId: string) {

    // =========================
    // 1️⃣ FETCH BOOKING (SERVICE ROLE)
    // =========================
    const { data: booking, error } = await this.supabase.client
      .from('bookings')
      .select(`
        *,
        users(name,email),
        booking_addons(quantity,price,source,puja_addons(title)),
        samagri_kits(name,price)
      `)
      .eq('id', bookingId)
      .maybeSingle();

    if (error || !booking) {
      throw new BadRequestException('Booking not found');
    }

    // =========================
    // 2️⃣ EXISTING INVOICE?
    // =========================
    const { data: old } = await this.supabase.client
      .from('booking_invoices')
      .select('*')
      .eq('booking_id', bookingId)
      .maybeSingle();

    if (old) return old;

    // =========================
    // 3️⃣ BUILD ITEMS + CALC
    // =========================
    let subtotal = 0;
    const rows: string[] = [];

    // 🔵 PACKAGE OR BASE PUJA
    if (booking.pricing_id) {
      const { data: pkg } = await this.supabase.client
        .from('puja_pricing_options')
        .select('title,amount')
        .eq('id', booking.pricing_id)
        .maybeSingle();

      if (!pkg) throw new BadRequestException('Package missing');

      subtotal += Number(pkg.amount);

      rows.push(`
      <tr>
        <td>${pkg.title} (Package)</td>
        <td>9997</td>
        <td>1</td>
        <td>₹${pkg.amount}</td>
        <td>₹${pkg.amount}</td>
      </tr>
      `);
    } else {
      const { data: puja } = await this.supabase.client
        .from('pujas')
        .select('title,base_price')
        .eq('id', booking.puja_id)
        .maybeSingle();

      if (!puja) throw new BadRequestException('Puja missing');

      subtotal += Number(puja.base_price);

      rows.push(`
      <tr>
        <td>${puja.title}</td>
        <td>9997</td>
        <td>1</td>
        <td>₹${puja.base_price}</td>
        <td>₹${puja.base_price}</td>
      </tr>
      `);
    }

    // 🔶 ADDONS
    for (const a of booking.booking_addons ?? []) {
      const amount = a.price * a.quantity;
      subtotal += amount;

      rows.push(`
      <tr>
        <td>${a.puja_addons.title}${a.price === 0 ? ' (Included)' : ''}</td>
        <td>9985</td>
        <td>${a.quantity}</td>
        <td>₹${a.price}</td>
        <td>₹${amount}</td>
      </tr>
      `);
    }

    // 🟡 SAMAGRI
    if (booking.samagri_included && booking.samagri_kits) {
      subtotal += Number(booking.samagri_kits.price);

      rows.push(`
      <tr>
        <td>Samagri – ${booking.samagri_kits.name}</td>
        <td>9985</td>
        <td>1</td>
        <td>₹${booking.samagri_kits.price}</td>
        <td>₹${booking.samagri_kits.price}</td>
      </tr>
      `);
    }

    // =========================
    // 4️⃣ GST SPLIT
    // =========================
    const cgst = +(subtotal * 0.09).toFixed(2);
    const sgst = +(subtotal * 0.09).toFixed(2);
    const total = subtotal + cgst + sgst;

    // =========================
    // 5️⃣ QR + HTML
    // =========================
    const invoiceNumber = generateInvoiceNumber();

    const qrCodeBase64 = await QRCode.toDataURL(
      `PUJAONE|INV:${invoiceNumber}|BOOKING:${bookingId}|AMT:${total}`,
    );

    const html = invoiceHtmlTemplate({
      invoiceNumber,
      invoiceDate: new Date().toLocaleDateString('en-IN'),
      customerName: booking.users.name,
      customerEmail: booking.users.email,
      itemsHtml: rows.join(''),
      subtotal,
      cgst,
      sgst,
      total,
      qrCodeBase64,
    });

    // =========================
    // 6️⃣ HTML → PDF
    // =========================
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = Buffer.from(
      await page.pdf({ format: 'A4', printBackground: true }),
    );

    await browser.close();

    // =========================
    // 7️⃣ UPLOAD TO SUPABASE
    // =========================
    const year = new Date().getFullYear();
    const path = `${year}/${invoiceNumber}.pdf`;

    await this.supabase.client.storage
      .from('invoices')
      .upload(path, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    const { data: url } = this.supabase.client.storage
      .from('invoices')
      .getPublicUrl(path);

    // =========================
    // 8️⃣ SAVE DB
    // =========================
    const { data: invoice } = await this.supabase.client
      .from('booking_invoices')
      .insert({
        booking_id: bookingId,
        invoice_number: invoiceNumber,
        invoice_url: url.publicUrl,
        total_amount: total,
      })
      .select()
      .single();

    // =========================
    // 9️⃣ EMAIL
    // =========================
    await this.emailService.sendInvoiceEmail({
      to: booking.users.email,
      name: booking.users.name,
      invoiceNumber,
      pdfBuffer,
    });

    return invoice;
  }
}
