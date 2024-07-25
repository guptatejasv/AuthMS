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

export const updatePhoneNo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
  } catch (err) {
    res.status(400).json({
      status: "success",
      message: err,
    });
  }
};
