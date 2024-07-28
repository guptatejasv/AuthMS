import { Request, Response } from "express";

import { Auth } from "../models/auth.model";

import { TwoFactorAuth } from "../models/auth.auth";

import nodemailer from "nodemailer";

// Your email transporter configuration
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const updateEmail = async (req: Request, res: Response) => {
  try {
    const id = req.user.id;

    const user = await Auth.findById(id);
    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "Something went wrong...",
      });
    }

    const digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < 6; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    const message = `${OTP} is your otp to update your email.`;
    const tFAuser = await TwoFactorAuth.findOne({ userId: req.user.id });
    if (tFAuser) {
      tFAuser.twoFAEmailOtp = OTP;
      await tFAuser?.save();
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

    // // 2) Generate the random reset token
    // const updateToken = crypto.randomBytes(32).toString("hex");

    // // Hash the token and set it to the user object with an expiration time
    // user.emailUpdateToken = crypto
    //   .createHash("sha256")
    //   .update(updateToken)
    //   .digest("hex");
    // user.emailUpdateTokenExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    // await user.save();

    // const resetURL = `http//:localhost:3000/api/v1/users/verifyEmail/${updateToken}`;

    // const message = `You attempted to update your email? Submit a request to: ${resetURL}.\n to verify first. if you didn't request to update your email, Please Ignore.`;
    // console.log(resetURL);

    // await transporter.sendMail({
    //   from: process.env.EMAIL_USER,
    //   to: user.email,
    //   subject: "Your Email verify Link.",
    //   text: message,
    // });

    // res.status(200).json({
    //   status: "success",
    //   message: "Email verification link is sent to your Email",
    // });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "There was an error sending the email. Try again later!",
    });
  }
};
