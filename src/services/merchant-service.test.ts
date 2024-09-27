import { Merchant, MerchantDocument } from "../models/merchant";
import { faker } from "@faker-js/faker";
import { MerchantService } from "./merchant-service";
import * as testUtils from "../test/test-utility";
import { ConflictError } from "@craftyverse-au/craftyverse-common";

describe("Merchant Service", () => {
  describe("getMerchantByName", () => {
    const companyName = faker.company.name();
    let mockMerchant: MerchantDocument;
    beforeAll(async () => {
      // Create A mock merchant
      mockMerchant = Merchant.build({
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
      await mockMerchant.save();
    });

    it("should return a merchant by name", async () => {
      const merchant = await MerchantService.getMerchantByName(companyName);

      expect(merchant).toBeDefined();
      expect(merchant).toEqual(mockMerchant.toJSON());
    });

    it("should return undefined if a merchant does not exist", async () => {
      const merchant = await MerchantService.getMerchantByName(
        "Nonexistent Company"
      );

      expect(merchant).toBeUndefined();
    });
  });

  describe("createMerchant", () => {
    it("should create a new merchant", async () => {
      const mockMerchant = await testUtils.createMockMerchant();
      const savedMerchant: MerchantDocument | string =
        await MerchantService.createMerchant(mockMerchant);

      const merchant = await Merchant.findOne({
        merchantName: savedMerchant.merchantName,
      });

      expect(merchant).toBeDefined();
      expect(merchant?.merchantType).toEqual(mockMerchant.merchantType);
      expect(merchant?.merchantUserId).toEqual(mockMerchant.merchantUserId);
      expect(merchant?.merchantName).toEqual(mockMerchant.merchantName);
      expect(merchant?.merchantDescription).toEqual(
        mockMerchant.merchantDescription
      );
      expect(merchant?.merchantCountry).toEqual(mockMerchant.merchantCountry);
      expect(merchant?.merchantState).toEqual(mockMerchant.merchantState);
      expect(merchant?.merchantAddressLine1).toEqual(
        mockMerchant.merchantAddressLine1
      );
      expect(merchant?.merchantAddressLine2).toEqual(
        mockMerchant.merchantAddressLine2
      );
      expect(merchant?.merchantPostCode).toEqual(mockMerchant.merchantPostCode);
      expect(merchant?.merchantOwnerFirstName).toEqual(
        mockMerchant.merchantOwnerFirstName
      );
      expect(merchant?.merchantOwnerLastName).toEqual(
        mockMerchant.merchantOwnerLastName
      );
      expect(merchant?.merchantOwnerEmail).toEqual(
        mockMerchant.merchantOwnerEmail
      );
      expect(merchant?.merchantOwnerPhone).toEqual(
        mockMerchant.merchantOwnerPhone
      );
      expect(merchant?.merchantOwnerLicenseDocumentUrl).toEqual(
        mockMerchant.merchantOwnerLicenseDocumentUrl
      );
      expect(merchant?.merchantOwnerProofOfAddressDocumentUrl).toEqual(
        mockMerchant.merchantOwnerProofOfAddressDocumentUrl
      );
      expect(merchant?.merchantStoreIndustry).toEqual(
        mockMerchant.merchantStoreIndustry
      );
      expect(merchant?.merchantStoreCurrency).toEqual(
        mockMerchant.merchantStoreCurrency
      );
      expect(merchant?.merchantStoreTimeZone).toEqual(
        mockMerchant.merchantStoreTimeZone
      );
    });

    it("should throw an error if a merchant already exists", async () => {
      const mockMerchant = await testUtils.createMockMerchant();
      await MerchantService.createMerchant(mockMerchant);

      await expect(
        MerchantService.createMerchant(mockMerchant)
      ).rejects.toThrow("Merchant already exists.");
    });
  });
});
