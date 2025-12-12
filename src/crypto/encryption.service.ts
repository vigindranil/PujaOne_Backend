import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
  private readonly algorithm = 'aes-256-cbc';
  private readonly key = Buffer.from(process.env.ENCRYPTION_KEY || '', 'base64');
  private readonly iv = Buffer.from(process.env.ENCRYPTION_IV || '', 'base64');

  encrypt(text: string): string {
    const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    return encrypted.toString('base64');
  }

  decrypt(enc: string): string {
    const data = Buffer.from(enc, 'base64');
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
    const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
    return decrypted.toString('utf8');
  }
}
