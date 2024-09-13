import { ConflictError } from "@craftyverse-au/craftyverse-common";
import { Merchant } from "../models/merchant";
import { MerchantObject } from "../schemas/merchant-request-schema";
import { LoggingUtils } from "../utils/logging-utils";

export class MerchantService {
  /**
   * This function retrieves a merchant by name
   * @param merchantName
   * @returns
   */
  static async getMerchantByName(
    merchantName: string
  ): Promise<MerchantObject | undefined> {
    const existingMerchant = await Merchant.findOne({
      merchantName: merchantName,
    });

    if (!existingMerchant) {
      return undefined;
    }

    return existingMerchant.toJSON() as MerchantObject;
  }

  static async createMerchant(merchant: MerchantObject) {
    // Check for existing merchant
    const existingMerchant = await MerchantService.getMerchantByName(
      merchant.merchantName
    );

    if (existingMerchant) {
      const message = "Merchant already exists.";
      LoggingUtils.logEvent(
        undefined,
        "getMerchantByName: Merchant already exists.",
        "error.txt"
      );
      throw new ConflictError(message);
    }

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
