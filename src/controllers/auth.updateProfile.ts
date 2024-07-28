import { Request, Response } from "express";

import { Auth } from "../models/auth.model";

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const id = req.user.id;
    const userBlocked = await Auth.findById({ _id: id });
    if (userBlocked) {
      if (userBlocked.isBlocked) {
        return res.status(400).json({
          status: "fail",
          message: "You are blocked, you cann't update your profile.",
        });
      }
    }
    if (req.body.phone) {
      return res.status(400).json({
        message: "You can not update phone no.",
      });
    }
    if (req.body.email) {
      return res.status(400).json({
        message: "You can not update Email no.",
      });
    }
    const user = await Auth.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).select(
      "-password -passwordResetToken -createdAt -updatedAt -passwordResetExpires -isVerified"
    );
    res.status(200).json({
      status: "success",
      message: `Profile updated successfully...!`,
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
