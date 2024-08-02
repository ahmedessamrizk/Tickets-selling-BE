import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as CryptoJS from 'crypto-js';
// const CryptoJS = require('crypto-js');

@Injectable()
export class EncryptionService {
  constructor(private configService: ConfigService) {}

  encrypt(text: string): string {
    const encrypted = CryptoJS.AES.encrypt(
      text,
      this.configService.get<string>('ENCRYPTION_KEY'),
    ).toString();
    return encrypted;
  }

  decrypt(encryptedText: string): string {
    const bytes = CryptoJS.AES.decrypt(
      encryptedText,
      this.configService.get<string>('ENCRYPTION_KEY'),
    );
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
  }
}
