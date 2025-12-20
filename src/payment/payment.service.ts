import { Injectable, BadRequestException } from '@nestjs/common';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class PaymentService {
  private razorpay: Razorpay;

  constructor(private supabase: SupabaseService) {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
  }

  // =====================================
  // 1️⃣ CREATE RAZORPAY ORDER
  // =====================================
  async createOrder(bookingId: string) {
    const { data: booking, error } = await this.supabase.client
      .from('bookings')
      .select('id, price, payment_status')
      .eq('id', bookingId)
      .single();

    if (error || !booking) {
      throw new BadRequestException('Booking not found');
    }

    if (booking.payment_status === 'PAID') {
      throw new BadRequestException('Payment already completed');
    }

    const order = await this.razorpay.orders.create({
      amount: Number(booking.price) * 100,
      currency: 'INR',
      receipt: bookingId,
      payment_capture: true,
    });

    await this.supabase.client
      .from('bookings')
      .update({ razorpay_order_id: order.id })
      .eq('id', bookingId);

    return order;
  }

  // =====================================
  // 2️⃣ VERIFY WEBHOOK SIGNATURE
  // =====================================
  verifySignature(rawBody: Buffer, signature: string): boolean {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) {
      throw new Error('RAZORPAY_WEBHOOK_SECRET missing');
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    return expectedSignature === signature;
  }

  // =====================================
  // 3️⃣ CONFIRM PAYMENT (IDEMPOTENT)
  // =====================================
  async confirmPayment(orderId: string, paymentId: string) {
    const { data: booking } = await this.supabase.client
      .from('bookings')
      .select('id, payment_status')
      .eq('razorpay_order_id', orderId)
      .single();

    if (!booking) return;

    // 🔁 IDEMPOTENT
    if (booking.payment_status === 'PAID') return;

    await this.supabase.client
      .from('bookings')
      .update({
        payment_status: 'PAID',
        status: 'CONFIRMED',
        razorpay_payment_id: paymentId,
      })
      .eq('id', booking.id);
  }

  // =====================================
  // 4️⃣ CONFIRM REFUND (IDEMPOTENT)
  // =====================================
  async confirmRefund(paymentId: string, refundId: string) {
    // Update refund table (if exists)
    await this.supabase.client
      .from('booking_refunds')
      .update({
        status: 'SUCCESS',
        razorpay_refund_id: refundId,
        processed_at: new Date(),
      })
      .eq('razorpay_payment_id', paymentId)
      .eq('status', 'PENDING');

    // Update booking
    await this.supabase.client
      .from('bookings')
      .update({
        status: 'CANCELLED',
        payment_status: 'REFUNDED',
      })
      .eq('razorpay_payment_id', paymentId);
  }
}
