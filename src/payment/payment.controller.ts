import {
  Controller,
  Post,
  Req,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { PaymentService } from './payment.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentService: PaymentService) {}

  // =====================================================
  // 🔐 RAZORPAY WEBHOOK (SECURE + IDEMPOTENT)
  // =====================================================
  @Post('webhook/razorpay')
  @Public()
  async razorpayWebhook(
    @Req() req: any,
    @Headers('x-razorpay-signature') signature: string,
  ) {
    if (!signature) {
      throw new BadRequestException('Missing Razorpay signature');
    }

    // 🔐 VERIFY SIGNATURE (RAW BODY)
    const isValid = this.paymentService.verifySignature(
      req.rawBody,
      signature,
    );

    if (!isValid) {
      throw new BadRequestException('Invalid webhook signature');
    }

    const event = req.body;

    // =================================================
    // 💳 PAYMENT SUCCESS
    // =================================================
    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity;

      await this.paymentService.confirmPayment(
        payment.order_id,
        payment.id,
      );
    }

    // =================================================
    // 💰 REFUND SUCCESS
    // =================================================
    if (event.event === 'refund.processed') {
      const refund = event.payload.refund.entity;

      await this.paymentService.confirmRefund(
        refund.payment_id,
        refund.id,
      );
    }

    return { received: true };
  }
}
