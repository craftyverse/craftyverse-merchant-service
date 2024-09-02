import { Merchant } from "../models/merchant";
import { MerchantObject } from "../schemas/merchant-request-schema";

export class MerchantService {
  static async getMerchantByName(merchantName: string) {
    const existingMerchant = await Merchant.findOne({
      merchantName: merchantName,
    });

    if (!existingMerchant) {
      return null;
    }

    return existingMerchant.toJSON();
  }

  static async createMerchant(merchant: MerchantObject) {
    const newMerchant = Merchant.build({
      merchantType: merchant.merchantType,
      merchantUserId: merchant.merchantUserId,
      merchantName: merchant.merchantName,
      merchantDescription: merchant.merchantDescription,
      merchantCountry: merchant.merchantCountry,
      merchantState: merchant.merchantState,
      merchantAddressLine1: merchant.merchantAddressLine1,
      merchantAddressLine2: merchant.merchantAddressLine2,
      merchantPostCode: merchant.merchantPostCode,
      merchantOwnerFirstName: merchant.merchantOwnerFirstName,
      merchantOwnerLastName: merchant.merchantOwnerLastName,
      merchantOwnerEmail: merchant.merchantOwnerEmail,
      merchantOwnerPhone: merchant.merchantOwnerPhone,
      merchantOwnerLicenseDocumentUrl: merchant.merchantOwnerLicenseDocumentUrl,
      merchantOwnerProofOfAddressDocumentUrl:
        merchant.merchantOwnerProofOfAddressDocumentUrl,
      merchantStoreIndustry: merchant.merchantStoreIndustry,
      merchantStoreCurrency: merchant.merchantStoreCurrency,
      merchantStoreTimeZone: merchant.merchantStoreTimeZone,
    });

    return await newMerchant.save();
  }
}
