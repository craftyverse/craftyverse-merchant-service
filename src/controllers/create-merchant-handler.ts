import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import {
  RequestValidationError,
  NotAuthorisedError,
} from "@craftyverse-au/craftyverse-common";
import { merchantRequestSchema } from "../schemas/merchant-request-schema";
import { MerchantService } from "../services/merchant-service";
import { AuthenticationUtils } from "../utils/authentication-utils";
import { LoggingUtils } from "../utils/logging-utils";

/**
 * Request type: POST
 * Route: /createmerchant
 * Description: This function creates a new merchant
 *
 * @param req
 * @param res
 */
const createMerchantHandler = asyncHandler(
  async (req: Request, res: Response) => {
    console.log(process.env.NODE_ENV);
    // Verifying user token
    const token = req.headers.authorization;
    const decodedToken = await AuthenticationUtils.verifyAuthenticationToken(
      token
    );

    if (
      decodedToken.UserInfo.userEmail !== req.body.merchantOwnerEmail ||
      decodedToken.UserInfo.userId !== req.body.merchantUserId
    ) {
      LoggingUtils.logEvent(
        "User not authorised to create merchant",
        "error.txt",
        req
      );
      throw new NotAuthorisedError();
    }

    // Validating merchant data
    const merchantData = merchantRequestSchema.safeParse(req.body);

    if (!merchantData.success) {
      LoggingUtils.logEvent(merchantData.error.issues, "error.txt", req);
      throw new RequestValidationError(merchantData.error.issues);
    }

    const merchant = merchantData.data;

    // Create new merchant
    await MerchantService.createMerchant(merchant);

    // publish sns merchant created event
    // TODO

    res.status(200).json({
      message: "Merchant created successfully",
    });
  }
);

export { createMerchantHandler };
