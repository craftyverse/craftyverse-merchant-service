import request from "supertest";
import { app } from "../app";
import { faker } from "@faker-js/faker";
import { MerchantObject } from "../schemas/merchant-request-schema";
import { LoggingUtils } from "../utils/logging-utils";

const userId = faker.string.uuid();

const mockMerchant: MerchantObject = {
  merchantType: "Supplier",
  merchantUserId: userId,
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
};

const token = global.signup(userId);

describe("POST /creatmerchant", () => {
  it("should return a NotAuthorised Error if the userId in the payload does not match the access token", async () => {
    const unauthorisedMerchant = {
      ...mockMerchant,
      merchantUserId: faker.string.uuid(),
      merchantOwnerEmail: "tony.li@test.io",
    };
    const response = await request(app)
      .post("/api/merchant/createmerchant")
      .set("Authorization", `${token}`)
      .send(unauthorisedMerchant);

    console.log(response.body);

    expect(response.status).toBe(401);
    expect(response.body.errors[0].message).toBe("Not authorised");
  });

  it('should log "User not authorised to create merchant" to error.txt if the userId in the payload does not match the access token', async () => {
    const unauthorisedMerchant = {
      ...mockMerchant,
      merchantUserId: faker.string.uuid(),
      merchantOwnerEmail: "tony.li@test.io",
    };
    const response = await request(app)
      .post("/api/merchant/createmerchant")
      .set("Authorization", `${token}`)
      .send(unauthorisedMerchant);

    expect(response.status).toBe(401);
    expect(response.body.errors[0].message).toBe("Not authorised");

    const hasErrorLog = LoggingUtils.readErrorLog(
      "../logs/error.txt",
      "User not authorised to create merchant"
    );
    expect(hasErrorLog).toBe(true);
  });

  it("should return a NotAuthorised Error if the userEmail in the payload does not match the access token", async () => {
    const unauthorisedMerchant = {
      ...mockMerchant,
      merchantUserId: userId,
    };

    const response = await request(app)
      .post("/api/merchant/createmerchant")
      .set("Authorization", `${token}`)
      .send(unauthorisedMerchant);

    expect(response.status).toBe(401);
    expect(response.body.errors[0].message).toBe("Not authorised");
  });

  it('should log "User not authorised to create merchant" to error.txt if the merchantUserEmail in the payload does not match the access token', async () => {
    const unauthorisedMerchant = {
      ...mockMerchant,
      merchantUserId: userId,
    };
    const response = await request(app)
      .post("/api/merchant/createmerchant")
      .set("Authorization", `${token}`)
      .send(unauthorisedMerchant);

    expect(response.status).toBe(401);
    expect(response.body.errors[0].message).toBe("Not authorised");

    const hasErrorLog = LoggingUtils.readErrorLog(
      "../logs/error.txt",
      "User not authorised to create merchant"
    );
    expect(hasErrorLog).toBe(true);
  });

  it("should return a RequestValidationError if the merchant request payload is invalid", async () => {
    const invalidMerchant = {
      merchantUserId: userId,
      merchantOwnerEmail: "tony.li@test.io",
    };

    const response = await request(app)
      .post("/api/merchant/createmerchant")
      .set("Authorization", `${token}`)
      .send(invalidMerchant);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      errors: [
        { message: "Required", field: "merchantType" },
        { message: "Required", field: "merchantName" },
        { message: "Required", field: "merchantCountry" },
        { message: "Required", field: "merchantState" },
        { message: "Required", field: "merchantAddressLine1" },
        { message: "Required", field: "merchantPostCode" },
        { message: "Required", field: "merchantOwnerFirstName" },
        { message: "Required", field: "merchantOwnerLastName" },
        { message: "Required", field: "merchantOwnerPhone" },
        { message: "Required", field: "merchantOwnerLicenseDocumentUrl" },
        {
          message: "Required",
          field: "merchantOwnerProofOfAddressDocumentUrl",
        },
        { message: "Required", field: "merchantStoreIndustry" },
        { message: "Required", field: "merchantStoreCurrency" },
        { message: "Required", field: "merchantStoreTimeZone" },
      ],
    });
  });
});
