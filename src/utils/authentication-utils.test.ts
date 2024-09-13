import { AuthenticationUtils } from "./authentication-utils";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { faker } from "@faker-js/faker";
import { app } from "../app";
import mongoose from "mongoose";
import { RequestValidationError } from "@craftyverse-au/craftyverse-common";

describe("AuthenticationUtils", () => {
  describe("verifyAuthenticationToken", () => {
    let userId = new mongoose.Types.ObjectId().toHexString();
    let userFirstName = faker.person.firstName();
    let userLastName = faker.person.lastName();
    let userEmail = faker.internet.email();
    let userRoles = [123, 456];
    const setup = () => {
      const userInfo = {
        UserInfo: {
          userId,
          userFirstName,
          userLastName,
          userEmail,
          userRoles,
        },
      };
      // Generate JWT
      const accessToken = jwt.sign(
        userInfo,
        process.env.ACCESS_TOKEN_SECRET
          ? process.env.ACCESS_TOKEN_SECRET
          : "secret",
        { expiresIn: process.env.ACCESS_TOKEN_LIFE }
      );

      return `Bearer ${accessToken}`;
    };
    it("should throw NotAuthorisedError if token is not provided", () => {
      const token = undefined;

      const verifiedToken =
        AuthenticationUtils.verifyAuthenticationToken(token);

      expect(verifiedToken).rejects.toThrow();
    });

    it("should return decoded token if token is provided", async () => {
      const token = setup();

      const verifiedToken =
        (await AuthenticationUtils.verifyAuthenticationToken(
          token
        )) as jwt.JwtPayload;

      expect(verifiedToken).toEqual({
        UserInfo: {
          userId,
          userFirstName,
          userLastName,
          userEmail,
          userRoles,
        },
        iat: verifiedToken.iat,
        exp: verifiedToken.exp,
      });
    });

    it("should retun a error when the passed token is not a jwt token", async () => {
      // Write a test to throw if the token is not a JWT token
      const token = "Bearer not-a-jwt-token";
      const verifiedToken =
        AuthenticationUtils.verifyAuthenticationToken(token);

      expect(verifiedToken).rejects.toThrow(JsonWebTokenError);
    });

    it("should return a RequestValidationError if the token has missing properties", async () => {
      const userInfo = {
        UserInfo: {
          userFirstName,
          userLastName,
          userEmail,
          userRoles,
        },
      };
      // Generate JWT
      const accessToken = jwt.sign(
        userInfo,
        process.env.ACCESS_TOKEN_SECRET
          ? process.env.ACCESS_TOKEN_SECRET
          : "secret",
        { expiresIn: process.env.ACCESS_TOKEN_LIFE }
      );

      const invalidToken = `Bearer ${accessToken}`;

      const verifiedToken =
        AuthenticationUtils.verifyAuthenticationToken(invalidToken);

      expect(verifiedToken).rejects.toThrow(RequestValidationError);
    });
  });
});
