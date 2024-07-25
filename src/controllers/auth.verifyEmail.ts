import { Request, Response } from "express";
import { Auth } from "../models/auth.model";

export const verifyNewEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;
    const { newEmail } = req.body;
    if (!newEmail) {
      return res.status(400).json({
        status: "fail",
        message: "Please enter a new Email.",
      });
    }
    if (!token) {
      return res.status(400).json({
        status: "fail",
        message: "No token is provided",
      });
    }

    const user = await Auth.findOne({ emailUpdateToken: token });
    if (!user) {
      return res.status(400).json({ error: "Update Email token is invalid." });
    }
    user.emailUpdateToken = undefined;
    await user.save();
    await Auth.findByIdAndUpdate(user.id, {
      email: newEmail,
      isEmailVerified: true,
    });
    return res.status(200).json({ message: "Your Email has been updated." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "fail",
      message: error,
    });
  }
};
