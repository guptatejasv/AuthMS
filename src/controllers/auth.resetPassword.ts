import { Request, Response } from "express";
import { Auth } from "../models/auth.model";
import bcrypt from "bcryptjs";

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;
    const { newPassword } = req.body;
    if (!newPassword) {
      return res.status(400).json({
        status: "fail",
        message: "Please enter a new Password.",
      });
    }
    if (!token) {
      return res.status(400).json({
        status: "fail",
        message: "No token is provided",
      });
    }
    const resetToken = token;
    const user = await Auth.findOne({ passwordResetToken: resetToken });
    if (!user) {
      return res
        .status(400)
        .json({ error: "Reset password token is invalid." });
    }
    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    // Update password and clear the reset token
    user.password = newHashedPassword;
    user.passwordResetToken = undefined;
    await user.save();
    return res.status(200).json({ message: "Your password has been updated." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "fail",
      message: error,
    });
  }
};
