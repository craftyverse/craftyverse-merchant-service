import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import {
  RequestValidationError,
  NotAuthorisedError,
} from "@craftyverse-au/craftyverse-common";
import { merchantRequestSchema } from "../schemas/merchant-request-schema";
import { MerchantService } from "../services/merchant-service";
import { AuthenticationUtils } from "../utils/authentication-utils";
import { LoggingUtils } from "../utils/logging-utils";

const createMerchantHandler = asyncHandler(
  async (req: Request, res: Response) => {
    // Verifying user token
    const token = req.headers.authorization;
    const decodedToken = await AuthenticationUtils.verifyAuthenticationToken(
      token
    );

    if (decodedToken.UserInfo.userEmail !== req.body.merchantOwnerEmail) {
      LoggingUtils.logEvent(
        req,
        "User not authorised to create merchant",
        "error.txt"
      );
      throw new NotAuthorisedError();
    }

    // Validating merchant data
    const merchantData = merchantRequestSchema.safeParse(req.body);

    if (!merchantData.success) {
      LoggingUtils.logEvent(req, merchantData.error.issues, "error.txt");
      throw new RequestValidationError(merchantData.error.issues);
    }

    const merchant = merchantData.data;

    // Create new merchant
    await MerchantService.createMerchant(merchant);

    // publish sns merchant created event
    res.status(200).json({
      message: "Merchant created successfully",
    });
  }
);

export { createMerchantHandler };
