import * as CryptoJS from 'crypto-js';
import { ConfigService } from '@nestjs/config';
import { EncryptionService } from '../../../common/services/encryption.service';

export function decryptNationalIdHook(schema) {
  const encryptionService = new EncryptionService(new ConfigService());
  schema.post('find', function (docs) {
    docs.forEach((doc) => {
      if (doc.nationalId) {
        doc.nationalId = encryptionService.decrypt(doc.nationalId);
      }
    });
  });

  schema.post('findOne', function (doc) {
    if (doc && doc.nationalId) {
      doc.nationalId = encryptionService.decrypt(doc.nationalId);
    }
  });

  schema.post('findOneAndUpdate', function (doc) {
    if (doc && doc.nationalId) {
      doc.nationalId = encryptionService.decrypt(doc.nationalId);
    }
  });
}
