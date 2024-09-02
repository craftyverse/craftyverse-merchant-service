import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import {
  RequestValidationError,
  ConflictError,
  NotAuthorisedError,
} from "@craftyverse-au/craftyverse-common";
import { merchantRequestSchema } from "../schemas/merchant-request-schema";
import { UserObject, userTokenSchema } from "../schemas/user-token-schema";
import { logEvents } from "../middleware/log-events";
import { MerchantService } from "../services/merchant-service";

const createMerchantHandler = asyncHandler(
  async (req: Request, res: Response) => {
    // checking for token
    const token = req.headers.authorization;
    console.log(token);
    if (!token) {
      throw new NotAuthorisedError();
    }

    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET
      ? process.env.ACCESS_TOKEN_SECRET
      : "secret";

    // Verifying token
    const decodedToken = jwt.verify(token.split(" ")[1], accessTokenSecret);

    if (decodedToken) {
      const userTokenData = userTokenSchema.safeParse(decodedToken);
      if (!userTokenData.success) {
        logEvents(
          `${req.method}\t${req.headers.origin}\t${req.url}\t${JSON.stringify(
            userTokenData.error.issues
          )}`,
          "error.txt"
        );
        throw new RequestValidationError(userTokenData.error.issues);
      }
      const user: UserObject = userTokenData.data;

      if (user.UserInfo.userEmail !== req.body.merchantOwnerEmail) {
        logEvents(
          `${req.method}\t${req.headers.origin}\t${req.url}\t${JSON.stringify(
            "User not authorised to create merchant"
          )}`,
          "error.txt"
        );
        throw new NotAuthorisedError();
      }
    }

    // Validating merchant data
    const merchantData = merchantRequestSchema.safeParse(req.body);

    if (!merchantData.success) {
      logEvents(
        `${req.method}\t${req.headers.origin}\t${req.url}\t${JSON.stringify(
          merchantData.error.issues
        )}`,
        "error.txt"
      );
      throw new RequestValidationError(merchantData.error.issues);
    }

    const merchant = merchantData.data;

    // Checking for existing merchant in database
    const existingMerchant = await MerchantService.getMerchantByName(
      merchant.merchantName
    );

    if (existingMerchant) {
      const methodName = "getMerchantByEmail";
      const message = "Merchant already exists.";
      logEvents(
        `${req.method}\t${req.headers.origin}\t${methodName}\t${message}`,
        "error.txt"
      );
      throw new ConflictError(message);
    }

    // Create new merchant
    await MerchantService.createMerchant(merchant);

    // publish sns merchant created event

    res.status(200).json({
      message: "Merchant created successfully",
    });
  }
);

export { createMerchantHandler };
