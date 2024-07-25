import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { Auth } from "../models/auth.model";
import { sign } from "jsonwebtoken";
import { TwoFactorAuth } from "../models/auth.auth";
import { TwoFactorAuthMethod } from "../models/auth.twoFA";
import twilio from "twilio";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

dotenv.config();
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export const signin = async (req: Request, res: Response) => {
  try {
    if (req.body.username) {
      const { username, password } = req.body;
      if (!username || !password) {
        res.status(401).json({
          status: "fail",
          message: "Please enter Username and Password both..",
        });
      }
      const user = await Auth.findOne({ username }).select("+password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (user.isTwoFAEnable == false) {
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return res.status(400).json({ message: "Invalid credentials" });
        }

        const secret = process.env.JWT_SECRET as string;

        const token = sign({ id: user._id }, secret, {
          expiresIn: "90d",
        });
        if (user && isMatch) {
          res.status(200).json({
            status: "success",
            token,
          });
        }
      } else {
        const tFAuserMethod = await TwoFactorAuthMethod.findOne({
          userId: user._id,
        });
        const tFAuser = await TwoFactorAuth.findOne({ userId: user._id });
        if (tFAuserMethod?.method == "phone") {
          const digits = "0123456789";
          let OTP = "";
          for (let i = 0; i < 6; i++) {
            OTP += digits[Math.floor(Math.random() * 10)];
          }
          let msg;
          await client.messages
            .create({
              body: `your otp verification for user is ${OTP}`,
              to: `+91${user.phone}`,
              from: "+15078734130",
            })
            .then(() => {
              msg = "OTP sent to your phone no.";
            });

          if (tFAuser) {
            tFAuser.twoFAOtp = OTP;
            tFAuser.phone = user.phone;
            await tFAuser.save();
          }
          res.status(200).json({
            status: "success",
            message: `${msg}.You need to verify your number.`,
          });
        } else if (tFAuserMethod?.method == "email") {
          const digits = "0123456789";
          let OTP = "";
          for (let i = 0; i < 6; i++) {
            OTP += digits[Math.floor(Math.random() * 10)];
          }
          if (tFAuser) {
            tFAuser.twoFAOtp = OTP;
            tFAuser.phone = user.phone;
            await tFAuser.save();
          }

          const message = `${OTP} is your otp for Two Factor Authentication...!`;

          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Two Factor Authentication OTP",
            text: message,
          });

          res.status(200).json({
            status: "success",
            message:
              "Two Factor Authentication OTP has been sent to your email...!",
          });
        }
      }
    }
    if (req.body.email) {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(401).json({
          status: "fail",
          message: "Please enter Email and Password both..",
        });
      }
      const user = await Auth.findOne({ email }).select("+password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const secret = process.env.JWT_SECRET as string;

      const token = sign({ id: user._id }, secret, {
        expiresIn: "90d",
      });
      if (user && isMatch) {
        res.status(200).json({
          status: "success",
          token,
        });
      }
    }
    if (!req.body.username && !req.body.email) {
      return res.status(400).json({
        status: "fail",
        message: "Please Login using username or email with password..",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
