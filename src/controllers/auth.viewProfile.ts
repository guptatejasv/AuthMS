import { Request, Response } from "express";

import { Auth } from "../models/auth.model";

export const viewProfile = async (req: Request, res: Response) => {
  try {
    console.log(req.user);
    // const { id } = req.params;
    const id = req.user.id;

    console.log(id);

    const user = await Auth.findById(id).select(
      "-password -passwordResetToken -passwordResetExpires"
    );
    if (!user) {
      return res
        .status(400)
        .json({ error: "You are not authenticated to access this info.." });
    }
    if (user.isBlocked == false) {
      res.status(200).json({
        status: "success",
        user,
      });
    } else {
      res.status(400).json({
        status: "fail",
        message: "You are blocked, You cann't view your profile..!",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
