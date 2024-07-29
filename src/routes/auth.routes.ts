import { Router } from "express";
import { signup } from "./../controllers/auth.signup";
import { signin } from "./../controllers/auth.signin";
import { forgetPassword } from "../controllers/auth.forgetPassword";
import { resetPassword } from "../controllers/auth.resetPassword";
import { viewProfile } from "../controllers/auth.viewProfile";
import { verify_token } from "../helpers/jwtverify";
import { updateProfile } from "../controllers/auth.updateProfile";
import { verifyOtp } from "../controllers/auth.verifyOtp";
import { updatePhoneNo } from "../controllers/auth.updatePhone";
import { updateEmail } from "../controllers/auth.updateEmail";

import { authenticators } from "../controllers/auth.authenticator";
import { changeTwoFAMethod } from "../controllers/auth.changeTwoFAMethod";
import { onOffTwoFAStatus } from "../controllers/auth.onOffTwoFAStatus";
const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/forgetPassword", forgetPassword);
router.post("/resetPassword", resetPassword);
router.post("/verifyOtp", verifyOtp);
router.post("/authenticator", authenticators);

// Secured Routes

router.post("/changeTwoFAMethod", verify_token, changeTwoFAMethod);
router.post("/updateTwoFAStatus", verify_token, onOffTwoFAStatus);
router.get("/viewProfile", verify_token, viewProfile);
router.patch("/updateProfile", verify_token, updateProfile);
router.patch("/updatePhoneNo", verify_token, updatePhoneNo);
router.patch("/updateEmail", verify_token, updateEmail);

export default router;
