import { Request, Response } from "express";

import { TwoFactorAuth } from "../models/auth.auth";

export const authenticator = async (req: Request, res: Response) => {
  try {
    if (req.body.phoneOTP && req.body.phone) {
      const phoneOtp = req.body.phoneOTP;

      const storedOtp = await TwoFactorAuth.findOne({ phone: req.body.phone });

      if (phoneOtp == storedOtp?.twoFAOtp) {
        const doc = await TwoFactorAuth.findOne({
          phone: req.body.phone,
        }).select("_id userId");
        await TwoFactorAuth.findByIdAndDelete({ _id: doc?._id });

        return res.status(200).json({
          status: "success",
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

      const storedOtp = await TwoFactorAuth.findOne({ phone: req.body.phone });

      if (emailOTP == storedOtp?.twoFAEmailOtp) {
        const doc = await TwoFactorAuth.findOne({
          email: req.body.email,
        }).select("_id userId");
        await TwoFactorAuth.findByIdAndDelete({ _id: doc?._id });

        return res.status(200).json({
          status: "success",
          message: "Email Otp is Verified. You are logged in Successfully...!",
        });
      } else {
        return res.status(400).json({
          status: "fail",
          message: "Invalid Otp...",
        });
      }
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
