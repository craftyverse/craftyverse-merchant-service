import { Merchant } from "../models/merchant";
import { faker } from "@faker-js/faker";
import { MerchantService } from "./merchant-service";

describe("Merchant Service", () => {
  describe("getMerchantByName", () => {
    const companyName = faker.company.name();
    beforeAll(async () => {
      // Create A mock merchant
      const merchant = Merchant.build({
        merchantType: "Online",
        merchantUserId: faker.string.uuid(),
        merchantName: companyName,
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

      // Create merchant
      await merchant.save();

      const foundMerchant = await Merchant.findOne({
        merchantName: companyName,
      });

      console.log("Found Merchant: ", foundMerchant);
    });

    it("should return a merchant by name", async () => {
      const merchant = await MerchantService.getMerchantByName(companyName);

      console.log("Merchant: ", merchant);
    });
  });
});
