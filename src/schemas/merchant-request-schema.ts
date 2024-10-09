import { z } from "zod";

const merchantTypeEnum = z.enum(["Supplier", "Instructor", "Retailer"]);

export const merchantRequestSchema = z.object({
  merchantType: merchantTypeEnum,
  merchantUserId: z.string(),
  merchantName: z.string(),
  merchantDescription: z.string().optional(),
  merchantCountry: z.string(),
  merchantState: z.string(),
  merchantAddressLine1: z.string(),
  merchantAddressLine2: z.string().optional(),
  merchantPostCode: z.number(),
  merchantOwnerFirstName: z.string(),
  merchantOwnerLastName: z.string(),
  merchantOwnerEmail: z.string(),
  merchantOwnerPhone: z.string(),
  merchantOwnerLicenseDocumentUrl: z.string(),
  merchantOwnerProofOfAddressDocumentUrl: z.string(),
  merchantStoreIndustry: z.string(),
  merchantStoreCurrency: z.string(),
  merchantStoreTimeZone: z.string(),
});

export type MerchantObject = z.infer<typeof merchantRequestSchema>;
export type MerchantTypeEnum = z.infer<typeof merchantTypeEnum>;
