import { Request, Response } from "express";
import { TwoFactorAuthMethod } from "../models/auth.twoFA";
import { Auth } from "../models/auth.model";
import { TwoFactorAuth } from "../models/auth.auth";

export const updateTwoFAStatus = async (req: Request, res: Response) => {
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
    const { onOff } = req.body;
    const userId = req.user.id;
    // const user = await Auth.findById({ _id: userId }).select("isTwoFAEnable");

    if (onOff == "on") {
      await TwoFactorAuth.create({
        userId,
      });
      await TwoFactorAuthMethod.create({
        userId,
      });
      await Auth.findByIdAndUpdate(
        { _id: userId },
        {
          isTwoFAEnable: true,
        }
      );
    } else if (onOff == "off") {
      await Auth.findByIdAndUpdate(
        { _id: userId },
        {
          isTwoFAEnable: false,
        }
      );
      await TwoFactorAuth.findOneAndDelete({ userId });
      await TwoFactorAuthMethod.findOneAndDelete({ userId });
    }
    res.status(200).json({
      status: "success",
      message: `Two Factor Authentication is changed..`,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
