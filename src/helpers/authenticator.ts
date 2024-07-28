import { authenticator } from "otplib";

export const verifyTotpToken = (token: string, secret: string): boolean => {
  return authenticator.check(token, secret);
};
