import { Request, Response } from "express";
import { TwoFactorAuth } from "../models/auth.auth";
import { sign } from "jsonwebtoken";
import { verifyTotpToken } from "../helpers/authenticator";
import { TwoFactorAuthMethod } from "../models/auth.twoFA";
import { Auth } from "../models/auth.model";
import { LoginHistory } from "../models/auth.loginHistories";

export const authenticators = async (req: Request, res: Response) => {
  try {
    let token;
    if (req.body.phoneOTP && req.body.phone) {
      const phoneOtp = req.body.phoneOTP;

      const storedOtp = await TwoFactorAuth.findOne({ phone: req.body.phone });
      if (storedOtp) {
        if (phoneOtp == storedOtp.twoFAOtp) {
          const doc = await TwoFactorAuth.findOne({
            phone: req.body.phone,
          }).select("_id userId");

          await TwoFactorAuth.findByIdAndUpdate(
            { _id: doc?._id },
            {
              twoFAOtp: "",
            }
          );
          if (doc) {
            const secret = process.env.JWT_SECRET as string;

            token = sign({ id: doc.userId }, secret, {
              expiresIn: "90d",
            });
            const user = await Auth.findById(doc._id);
            const loginHistory = new LoginHistory({
              userId: doc._id,
              ipAddress: req.ip,
              role: user?._id,
            });
            await loginHistory.save();
          }
        }

        return res.status(200).json({
          status: "success",
          token,
          message: "Phone Otp is Verified. You are logged in Successfully...!",
        });
      } else {
        return res.status(400).json({
          status: "fail",
          message: "Invalid Otp...",
        });
      }
    } else if (req.body.emailOTP && req.body.email) {
      const emailOTP = req.body.emailOTP;

      const storedOtp = await TwoFactorAuth.findOne({ email: req.body.email });

      if (emailOTP == storedOtp?.twoFAEmailOtp) {
        const doc = await TwoFactorAuth.findOne({
          email: req.body.email,
        }).select("_id userId");
        await TwoFactorAuth.findByIdAndUpdate(
          { _id: doc?._id },
          {
            twoFAEmailOtp: "",
          }
        );
        if (doc) {
          const secret = process.env.JWT_SECRET as string;

          token = sign({ id: doc.userId }, secret, {
            expiresIn: "90d",
          });
          const user = await Auth.findById(doc._id);
          const loginHistory = new LoginHistory({
            userId: doc._id,
            ipAddress: req.ip,
            role: user?._id,
          });
          await loginHistory.save();
        }

        return res.status(200).json({
          status: "success",
          token,
          message: "Email Otp is Verified. You are logged in Successfully...!",
        });
      } else {
        return res.status(400).json({
          status: "fail",
          message: "Invalid Otp...",
        });
      }
    } else if (req.body.email && req.body.token) {
      let logToken;
      const { email, token } = req.body;

      const doc = await Auth.findOne({ email });
      if (doc) {
        const secret_jwt = process.env.JWT_SECRET as string;

        logToken = sign({ id: doc._id }, secret_jwt, {
          expiresIn: "90d",
        });
        const user = await Auth.findById(doc._id);
        const loginHistory = new LoginHistory({
          userId: doc._id,
          ipAddress: req.ip,
          role: user?._id,
        });
        await loginHistory.save();
      }
      const secret = await TwoFactorAuthMethod.findOne({ email });

      if (secret) {
        const isValid = verifyTotpToken(token, secret.secret);
        console.log(isValid);
        if (!isValid) {
          return res.status(400).json({ error: "Invalid OTP" });
        } else {
          res.status(200).json({
            status: "success",
            logToken,
            message: "Otp is Verified. You are logged in Successfully...!",
          });
        }
      }
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
