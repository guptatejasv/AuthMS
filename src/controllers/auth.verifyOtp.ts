import { Request, Response } from "express";

import { Verification } from "../models/auth.verification";

import { Auth } from "../models/auth.model";

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId;
    if (req.body.signupOtp) {
      const { signupOtp } = req.body;
      const storedOtp = await Verification.findOne({ userId });

      if (signupOtp == storedOtp?.otp) {
        await Auth.findOneAndUpdate(
          { _id: userId },
          {
            isVerified: true,
          }
        );
        const otp = await Verification.findOne({ userId });
        if (otp) {
          otp.otp = "";
          await otp.save();
        }

        return res.status(200).json({
          status: "success",
          message: "User is verified successfully",
        });
      }
    } else if (req.body.newPhone && req.body.phoneOtp) {
      const { newPhone, phoneOtp } = req.body;
      const storedOtp = await Verification.findOne({ userId });
      console.log(storedOtp);
      if (phoneOtp == storedOtp?.updatePhoneOtp) {
        await Auth.findOneAndUpdate(
          { _id: userId },
          {
            phone: newPhone,
          }
        );
        const otp = await Verification.findOne({ userId });
        if (otp) {
          otp.updatePhoneOtp = "";
          await otp.save();
        }

        return res.status(200).json({
          status: "success",
          message:
            "Otp is Verified and Phone number is updated Successfully...!",
        });
      } else {
        return res.status(400).json({
          status: "fail",
          message: "Invalid Otp...",
        });
      }
    } else if (req.body.newEmail && req.body.emailOtp) {
      const { newEmail, emailOtp } = req.body;
      const Emailupdate = await Verification.findOne({ userId });
      if (Emailupdate) {
        if (Emailupdate.updateEmailOtp == emailOtp) {
          await Auth.findByIdAndUpdate(
            { _id: userId },
            {
              email: newEmail,
            }
          );

          Emailupdate.updateEmailOtp = "";
          await Emailupdate.save();

          return res.status(200).json({
            status: "success",
            message: "Otp is verified and Email is updated successfully..!",
          });
        } else {
          res.status(400).json({
            status: "fail",
            message: "Invalid Otp",
          });
        }
      }
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
