import { Merchant, MerchantDocument } from "../models/merchant";
import { faker } from "@faker-js/faker";

export const createMockMerchant = async (): Promise<MerchantDocument> => {
  return Merchant.build({
    merchantType: "Seller",
    merchantUserId: faker.string.uuid(),
    merchantName: faker.company.name(),
    merchantDescription: faker.lorem.sentence(),
    merchantCountry: faker.location.country(),
    merchantState: faker.location.state(),
    merchantAddressLine1: faker.location.streetAddress(),
    merchantAddressLine2: faker.location.secondaryAddress(),
    merchantPostCode: parseInt(faker.location.zipCode()),
    merchantOwnerFirstName: faker.person.firstName(),
    merchantOwnerLastName: faker.person.lastName(),
    merchantOwnerEmail: faker.internet.email(),
    merchantOwnerPhone: faker.phone.number(),
    merchantOwnerLicenseDocumentUrl: faker.internet.url(),
    merchantOwnerProofOfAddressDocumentUrl: faker.internet.url(),
    merchantStoreIndustry: faker.company.buzzPhrase(),
    merchantStoreCurrency: faker.finance.currencyCode(),
    merchantStoreTimeZone: faker.location.timeZone(),
  });
};
