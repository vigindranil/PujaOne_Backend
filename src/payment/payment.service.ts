import { Injectable, BadRequestException } from '@nestjs/common';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class PaymentService {
  private razorpay: Razorpay;

  constructor(private supabase: SupabaseService) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay credentials missing');
    }

    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  // =====================================================
  // 1️⃣ CREATE RAZORPAY ORDER
  // =====================================================
  async createOrder(booking_id: string) {
    const { data: booking, error } = await this.supabase.client
      .from('bookings')
      .select('id, price, payment_status')
      .eq('id', booking_id)
      .single();

    if (error || !booking) {
      throw new BadRequestException('Booking not found');
    }

    if (booking.payment_status === 'PAID') {
      throw new BadRequestException('Payment already completed');
    }

    const order = await this.razorpay.orders.create({
      amount: Math.round(Number(booking.price) * 100), // paise
      currency: 'INR',
      receipt: booking_id,
      payment_capture: true,
    });

    // 🔥 Store order in separate table (BEST PRACTICE)
    await this.supabase.client
      .from('booking_payments')
      .insert({
        booking_id,
        razorpay_order_id: order.id,
        amount: booking.price,
        status: 'CREATED',
      });

    return {
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    };
  }

  // =====================================================
  // 2️⃣ VERIFY WEBHOOK SIGNATURE (RAW BODY REQUIRED)
  // =====================================================
  verifySignature(rawBody: Buffer, signature: string): boolean {
    if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
      throw new Error('Webhook secret missing');
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest('hex');

    return expectedSignature === signature;
  }

  // =====================================================
  // 3️⃣ CONFIRM PAYMENT (IDEMPOTENT)
  // =====================================================
  async confirmPayment(
    razorpay_order_id: string,
    razorpay_payment_id: string,
  ) {
    const { data: payment, error } = await this.supabase.client
      .from('booking_payments')
      .select('*')
      .eq('razorpay_order_id', razorpay_order_id)
      .single();

    if (error || !payment) {
      throw new BadRequestException('Invalid payment reference');
    }

    // 🔥 IDEMPOTENCY GUARANTEE
    if (payment.status === 'PAID') {
      return; // already processed → ignore duplicate webhook
    }

    // 1️⃣ Mark payment table
    await this.supabase.client
      .from('booking_payments')
      .update({
        status: 'PAID',
        razorpay_payment_id,
      })
      .eq('id', payment.id);

    // 2️⃣ Update booking
    await this.supabase.client
      .from('bookings')
      .update({
        payment_status: 'PAID',
        status: 'CONFIRMED',
        razorpay_payment_id,
      })
      .eq('id', payment.booking_id);
  }

  // =====================================================
// 4️⃣ CONFIRM REFUND (IDEMPOTENT)
// =====================================================
async confirmRefund(
  razorpay_payment_id: string,
  razorpay_refund_id: string,
) {
  const { data: booking, error } = await this.supabase.client
    .from('bookings')
    .select('id, payment_status')
    .eq('razorpay_payment_id', razorpay_payment_id)
    .single();

  if (error || !booking) {
    return; // 🔥 silently ignore (webhook safety)
  }

  // 🔥 IDEMPOTENCY CHECK
  if (booking.payment_status === 'REFUNDED') {
    return;
  }

  // ✅ update refund table
  await this.supabase.client
    .from('booking_refunds')
    .update({
      status: 'SUCCESS',
      razorpay_refund_id,
      processed_at: new Date(),
    })
    .eq('booking_id', booking.id)
    .eq('status', 'PENDING');

  // ✅ update booking
  await this.supabase.client
    .from('bookings')
    .update({
      status: 'CANCELLED',
      payment_status: 'REFUNDED',
    })
    .eq('id', booking.id);
}

}
