import { z } from "zod";

export const userTokenSchema = z.object({
  UserInfo: z.object({
    userId: z.string(),
    userFirstName: z.string(),
    userLastName: z.string(),
    userEmail: z.string(),
    userRoles: z.array(z.number()),
  }),
  iat: z.number(),
  exp: z.number(),
});

export type UserObject = z.infer<typeof userTokenSchema>;
