import { Request, Response } from "express";

import { Auth } from "../models/auth.model";

import nodemailer from "nodemailer";
import { Verification } from "../models/auth.verification";

// Your email transporter configuration
const transporter = nodemailer.createTransport({
  host: "smtp.mailgun.org",
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const updateEmail = async (req: Request, res: Response) => {
  try {
    const id = req.user.id;

    const userBlocked = await Auth.findById({ _id: id });
    if (userBlocked) {
      if (userBlocked.isBlocked == true || userBlocked.isVerified == false) {
        return res.status(400).json({
          status: "fail",
          message:
            "You are blocked or not verified user, you cann't update your email.",
        });
      }
    }
    const { email } = req.body;

    const user = await Auth.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "There is no user with this email.",
      });
    }

    const digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < 6; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    const message = `${OTP} is your otp to update your email.`;
    const EmailupdateOtp = await Verification.findOne({ userId: req.user.id });
    if (EmailupdateOtp) {
      EmailupdateOtp.updateEmailOtp = OTP;
      await EmailupdateOtp.save();
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Email updation OTP",
      text: message,
    });

    res.status(200).json({
      status: "success",
      message: "Email updation OTP has been sent to your email...!",
    });

    // });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "There was an error sending the email. Try again later!",
    });
  }
};
