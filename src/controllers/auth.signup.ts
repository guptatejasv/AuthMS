import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";
import { Auth } from "../models/auth.model";

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, password, phone, dob, address } = req.body;
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
    if (!address) {
      return res.send({ message: "address is required!" });
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
      address,
    });
    const secret = process.env.JWT_SECRET as string;
    const token = sign({ id: user._id }, secret, {
      expiresIn: "90d",
    });
    res.status(201).json({
      status: "Success",
      token,
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
