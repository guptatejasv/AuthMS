import { Request, Response } from "express";
import { TwoFactorAuthMethod } from "../models/auth.twoFA";
import { Auth } from "../models/auth.model";

export const changeTwoFAMethod = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const id = req.user.id;
    const userBlocked = await Auth.findById({ _id: id });
    if (userBlocked) {
      if (userBlocked.isBlocked == true || userBlocked.isVerified == false) {
        return res.status(400).json({
          status: "fail",
          message:
            "You are blocked or not verified user, you cann't change Two Factor Method.",
        });
      }
    }
    console.log(userId);
    const { changeMethod } = req.body;
    if (!changeMethod) {
      return res.status(400).json({
        status: "fail",
        message: "Please choose a 2FA method..",
      });
    }

    const user = await TwoFactorAuthMethod.findOne({ userId: userId });
    console.log(user);
    if (user) {
      const previousMethod = user.method;
      if (previousMethod == changeMethod) {
        return res.status(400).json({
          status: "fail",
          message: "Please Choose another 2FA method..",
        });
      }
      await TwoFactorAuthMethod.findByIdAndUpdate(
        { _id: user?._id },
        {
          method: changeMethod,
        }
      );
      res.status(200).json({
        status: "success",
        message: `Two Factor Authentication Method is changed from ${previousMethod} to ${changeMethod}..`,
      });
    }
    // if (method == "off") {
    //   if (user) {
    //     user.isTwoFAEnable = false;
    //     await user.save();
    //   }
    // } else if (method == "phone" || method == "email") {
    //   if (user?.isTwoFAEnable == false) {
    //     await Auth.findByIdAndUpdate(userId, {
    //       isTwoFAEnable: true,
    //     });
    //     await TwoFactorAuth.create({
    //       userId,
    //     });
    //     await TwoFactorAuthMethod.create({
    //       userId,
    //       method,
    //     });
    //   }
    // }
    // if(changeMethod == 'phone'){

    // }else if(changeMethod == 'email'){

    // }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
