import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { sign } from "jsonwebtoken";
import { Auth } from "../models/auth.model";
import { Verification } from "../models/auth.verification";
import twilio from "twilio";

dotenv.config();
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export const signup = async (req: Request, res: Response) => {
  try {
    const {
      username,
      email,
      password,
      phone,
      dob,
      street,
      city,
      state,
      pin,
      country,
      firstName,
      lastName,
      role,
    } = req.body;
    if (!username) {
      return res.send({ message: "Username is required!" });
    }

    if (!email) {
      return res.send({ message: "Email is required!" });
    }
    if (!phone) {
      return res.send({ message: "Phone is required!" });
    }
    if (!dob) {
      return res.send({ message: "Date of Birth is required!" });
    }
    if (!password) {
      return res.send({ message: "password is required!" });
    }

    // const userExist = await Auth.findOne({ email });
    // if (userExist) {
    //   res.send({ message: "User already exist, Please Login.. " });
    // }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await Auth.create({
      username,
      email,
      password: hashedPassword,
      phone,
      dob,
      address: {
        street,
        city,
        state,
        pin,
        country,
      },
      profile: {
        firstName,
        lastName,
      },
      role,
    });

    const secret = process.env.JWT_SECRET as string;
    const token = sign({ id: user._id }, secret, {
      expiresIn: "90d",
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
        to: `+91${phone}`,
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
    req.user = user;

    res.status(201).json({
      status: "Success",
      token,
      msg,
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "success",
      message: err,
    });
  }
};
