import { Request, Response } from "express";

import { Verification } from "../models/auth.verification";

export const verifyPhone = async (req: Request, res: Response) => {
  try {
    const { phone, otp } = req.body;

    const storedOtp = await Verification.findOne({ phone: phone });
    console.log(storedOtp);
    if (otp == storedOtp?.otp) {
      return res.status(200).json({
        status: "success",
        message: "Otp is Verified Successfully...!",
      });
      const doc = await Verification.findOne({ phone }).select("_id");
      await Verification.findByIdAndDelete({ _id: doc });
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
