import { Request, Response } from "express";
import dotenv from "dotenv";
import { Auth } from "../models/auth.model";
import { Verification } from "../models/auth.verification";
import twilio from "twilio";

dotenv.config();
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export const updatePhoneNo = async (req: Request, res: Response) => {
  try {
    const id = req.user.id;
    const { newPhone } = req.body;
    const user = await Auth.findById(id);
    if (!user) {
      return res.status(400).json({
        status: "success",
        message: "Something went wrong..",
      });
    }

    await Auth.findByIdAndUpdate(id, {
      phone: newPhone,
      isVerified: false,
    });

    const digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < 6; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    let msg;
    await client.messages
      .create({
        body: `your otp verification for user is ${OTP}`,
        to: `+91${newPhone}`,
        from: "+15078734130",
      })
      .then(() => {
        msg = "OTP sent to your phone no.";
      });

    await Verification.create({
      userId: user._id,
      phone: user.phone,
      otp: OTP,
    });
    res.status(200).json({
      status: "success",
      message: `${msg}.You need to verify your number.`,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
