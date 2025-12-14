import {
  Controller,
  Post,
  Headers,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { PaymentService } from '../payment.service';

@Controller('webhook/razorpay')
export class RazorpayWebhookController {
  constructor(private service: PaymentService) {}

  @Post()
  async handle(@Req() req, @Headers('x-razorpay-signature') signature: string) {
    const body = req.body;

    const valid = this.service.verifySignature(body, signature);
    if (!valid) throw new BadRequestException('Invalid signature');

    if (body.event === 'payment.captured') {
      const booking_id = body.payload.payment.entity.receipt;
      const payment_id = body.payload.payment.entity.id;

      await this.service.confirmPayment(booking_id, payment_id);
    }

    return { received: true };
  }
}
