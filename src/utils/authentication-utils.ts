import {
  NotAuthorisedError,
  RequestValidationError,
} from "@craftyverse-au/craftyverse-common";
import jwt from "jsonwebtoken";
import { userTokenSchema } from "../schemas/user-token-schema";
import { LoggingUtils } from "./logging-utils";

interface UserObject {
  UserInfo: {
    userId: string;
    userFirstName: string;
    userLastName: string;
    userEmail: string;
    userRoles: number[];
  };
  iat: number;
  exp: number;
}

/**
 * Utility function to verify the user authentication token
 * @param token - The user authentication token which is of type Bearer
 */
export class AuthenticationUtils {
  static async verifyAuthenticationToken(
    token: string | undefined
  ): Promise<UserObject> {
    console.log;
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET
      ? process.env.ACCESS_TOKEN_SECRET
      : "secret";

    if (!token) {
      LoggingUtils.logEvent(
        "Please provide a valid user authentication token",
        "error.txt"
      );
      throw new NotAuthorisedError();
    }

    // Verifying token
    const verifiedToken = jwt.verify(token.split(" ")[1], accessTokenSecret);

    const userTokenData = userTokenSchema.safeParse(verifiedToken);
    if (!userTokenData.success) {
      LoggingUtils.logEvent(
        "The user information within the token does not seem to be correct",
        "error.txt"
      );
      throw new RequestValidationError(userTokenData.error.issues);
    }

    const decodedToken = userTokenData.data;

    return decodedToken;
  }

  static checkUserAuthorization() {}
}
