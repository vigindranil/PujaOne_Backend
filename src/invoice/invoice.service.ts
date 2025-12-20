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
  ) { }

async generateInvoice(bookingId: string) {
  // =========================
  // 1️⃣ FETCH BOOKING
  // =========================
  const { data: booking, error } = await this.supabase.client
    .from('bookings')
    .select(`
      *,
      users(name,email),
      booking_addons(
        quantity,
        price,
        source,
        puja_addons(title)
      ),
      samagri_kits(name,price)
    `)
    .eq('id', bookingId)
    .maybeSingle();

  console.log('BOOKING FETCH:', booking, error);

  if (error || !booking) {
    throw new BadRequestException('Booking not found');
  }

  // =========================
  // 2️⃣ CHECK EXISTING INVOICE
  // =========================
  const { data: existing } = await this.supabase.client
    .from('booking_invoices')
    .select('*')
    .eq('booking_id', bookingId)
    .maybeSingle();

  if (existing) return existing;

  // =========================
  // 3️⃣ BUILD ITEMS
  // =========================
  let subtotal = 0;
  const rows: string[] = [];

  // 🔵 PACKAGE / BASE PUJA
  if (booking.pricing_id) {
    const { data: pkg } = await this.supabase.client
      .from('puja_pricing_options')
      .select('title, amount')
      .eq('id', booking.pricing_id)
      .maybeSingle();

    if (!pkg) throw new BadRequestException('Puja pricing not found');

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
      .select('title, base_price')
      .eq('id', booking.puja_id)
      .maybeSingle();

    if (!puja) throw new BadRequestException('Puja not found');

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
    const rate = Number(a.price);
    const amount = rate * a.quantity;
    subtotal += amount;

    rows.push(`
      <tr>
        <td>${a.puja_addons.title}${rate === 0 ? ' (Included)' : ''}</td>
        <td>9997</td>
        <td>${a.quantity}</td>
        <td>₹${rate}</td>
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
        <td>9997</td>
        <td>1</td>
        <td>₹${booking.samagri_kits.price}</td>
        <td>₹${booking.samagri_kits.price}</td>
      </tr>
    `);
  }

  // =========================
  // 4️⃣ GST
  // =========================
  const cgst = +(subtotal * 0.09).toFixed(2);
  const sgst = +(subtotal * 0.09).toFixed(2);
  const total = +(subtotal + cgst + sgst).toFixed(2);

  // =========================
  // 5️⃣ QR CODE
  // =========================
  const invoiceNumber = generateInvoiceNumber();

  const qrCodeBase64 = await QRCode.toDataURL(
    `PUJAONE|INV:${invoiceNumber}|BOOKING:${bookingId}|AMT:${total}`,
  );

  // =========================
  // 6️⃣ HTML TEMPLATE
  // =========================
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
  // 7️⃣ HTML → PDF (PUPPETEER)
  // =========================
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox'],
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });

  const pdfUint8 = await page.pdf({
    format: 'A4',
    printBackground: true,
  });

  await browser.close();

  const pdfBuffer = Buffer.from(pdfUint8);

  // =========================
  // 8️⃣ UPLOAD TO SUPABASE
  // =========================
  const year = new Date().getFullYear();
  const storagePath = `${year}/${invoiceNumber}.pdf`;

  await this.supabase.client.storage
    .from('invoices')
    .upload(storagePath, pdfBuffer, {
      contentType: 'application/pdf',
      upsert: true,
    });

  const { data: urlData } = this.supabase.client.storage
    .from('invoices')
    .getPublicUrl(storagePath);

  // =========================
  // 9️⃣ SAVE DB RECORD
  // =========================
  const { data: invoice } = await this.supabase.client
    .from('booking_invoices')
    .insert({
      booking_id: bookingId,
      invoice_number: invoiceNumber,
      invoice_url: urlData.publicUrl,
      total_amount: total,
    })
    .select()
    .single();

  // =========================
  // 🔟 EMAIL PDF
  // =========================
  await this.emailService.sendInvoiceEmail({
    to: booking.users.email,
    name: booking.users.name,
    invoiceNumber,
    pdfBuffer,
  });

  // =========================
  // ✅ FINAL RESPONSE
  // =========================
  return invoice;
}


}
