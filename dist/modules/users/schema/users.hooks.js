"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptNationalIdHook = decryptNationalIdHook;
const config_1 = require("@nestjs/config");
const encryption_service_1 = require("../../../common/services/encryption.service");
function decryptNationalIdHook(schema) {
    const encryptionService = new encryption_service_1.EncryptionService(new config_1.ConfigService());
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
//# sourceMappingURL=users.hooks.js.map