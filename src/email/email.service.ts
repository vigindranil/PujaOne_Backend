import { Injectable, BadRequestException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendInvoiceEmail(opts: {
    to: string;
    name: string;
    invoiceNumber: string;
    pdfBuffer: Buffer;
  }) {
    try {
      await this.transporter.sendMail({
        from: `"PujaOne" <${process.env.SMTP_USER}>`,
        to: opts.to,
        subject: `Invoice ${opts.invoiceNumber}`,
        html: `<p>Hi ${opts.name},<br/>Please find your invoice attached.</p>`,
        attachments: [
          {
            filename: `${opts.invoiceNumber}.pdf`,
            content: opts.pdfBuffer,
          },
        ],
      });
    } catch {
      throw new BadRequestException('Email failed');
    }
  }
}
