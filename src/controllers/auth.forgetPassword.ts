import { Request, Response } from "express";

import { Auth } from "../models/auth.model";

import crypto from "crypto";
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

export const forgetPassword = async (req: Request, res: Response) => {
  try {
    // 1) Get user based on POSTed email
    const { email } = req.body;
    const user = await Auth.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "There is no user with that email address." });
    }

    // 2) Generate the random reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash the token and set it to the user object with an expiration time
    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await user.save();

    // 3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get(
      "localhost:3000/api/v1/resetPassword"
    )}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
    console.log(resetURL);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Your password reset token (valid for 10 minutes)",
      text: message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "There was an error sending the email. Try again later!",
    });
  }
};
