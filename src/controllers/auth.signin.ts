import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { Auth } from "../models/auth.model";
import { sign } from "jsonwebtoken";

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
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
