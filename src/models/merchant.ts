import mongoose from "mongoose";

interface MerchantFields {
  merchantType: string;
  merchantUserId: string;
  merchantName: string;
  merchantDescription: string | undefined;
  merchantCountry: string;
  merchantState: string;
  merchantAddressLine1: string;
  merchantAddressLine2: string | undefined;
  merchantPostCode: number;
  merchantOwnerFirstName: string;
  merchantOwnerLastName: string;
  merchantOwnerEmail: string;
  merchantOwnerPhone: string;
  merchantOwnerLicenseDocumentUrl: string;
  merchantOwnerProofOfAddressDocumentUrl: string;
  merchantStoreIndustry: string;
  merchantStoreCurrency: string;
  merchantStoreTimeZone: string;
}

interface MerchantModel extends mongoose.Model<MerchantDocument> {
  build(fields: MerchantFields): MerchantDocument;
}

interface MerchantDocument extends mongoose.Document {
  merchantType: string;
  merchantUserId: string;
  merchantName: string;
  merchantDescription: string | undefined;
  merchantCountry: string;
  merchantState: string;
  merchantAddressLine1: string;
  merchantAddressLine2: string | undefined;
  merchantPostCode: number;
  merchantOwnerFirstName: string;
  merchantOwnerLastName: string;
  merchantOwnerEmail: string;
  merchantOwnerPhone: string;
  merchantOwnerLicenseDocumentUrl: string;
  merchantOwnerProofOfAddressDocumentUrl: string;
  merchantStoreIndustry: string;
  merchantStoreCurrency: string;
  merchantStoreTimeZone: string;
}

const merchantSchema = new mongoose.Schema({
  merchantType: { type: String, required: true },
  merchantUserId: { type: String, required: true },
  merchantName: { type: String, required: true },
  merchantDescription: { type: String, required: false },
  merchantCountry: { type: String, required: true },
  merchantState: { type: String, required: true },
  merchantAddressLine1: { type: String, required: true },
  merchantAddressLine2: { type: String, required: false },
  merchantPostCode: { type: Number, required: true },
  merchantOwnerFirstName: { type: String, required: true },
  merchantOwnerLastName: { type: String, required: true },
  merchantOwnerEmail: { type: String, required: true },
  merchantOwnerPhone: { type: String, required: true },
  merchantOwnerLicenseDocumentUrl: { type: String, required: true },
  merchantOwnerProofOfAddressDocumentUrl: { type: String, required: true },
  merchantStoreIndustry: { type: String, required: true },
  merchantStoreCurrency: { type: String, required: true },
  merchantStoreTimeZone: { type: String, required: true },
});

merchantSchema.statics.build = (fields: MerchantFields) => {
  return new Merchant(fields);
};

const Merchant = mongoose.model<MerchantDocument, MerchantModel>(
  "Merchant",
  merchantSchema
);

export { Merchant };
