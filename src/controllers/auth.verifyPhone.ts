import { Request, Response } from "express";

import { Verification } from "../models/auth.verification";

import { Auth } from "../models/auth.model";

export const verifyPhone = async (req: Request, res: Response) => {
  try {
    const { phone, otp } = req.body;

    const storedOtp = await Verification.findOne({ phone: phone });
    console.log(storedOtp);
    if (otp == storedOtp?.otp) {
      const doc = await Verification.findOne({ phone }).select("_id userId");
      await Verification.findByIdAndDelete({ _id: doc?._id });
      await Auth.findByIdAndUpdate(
        { _id: doc?.userId },
        {
          isVerified: true,
        }
      );
      return res.status(200).json({
        status: "success",
        message: "Otp is Verified Successfully...!",
      });
    } else {
      return res.status(400).json({
        status: "fail",
        message: "Invalid Otp...",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
