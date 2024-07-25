import { Router } from "express";
import { signup } from "./../controllers/auth.signup";
import { signin } from "./../controllers/auth.signin";
import { forgetPassword } from "../controllers/auth.forgetPassword";
import { resetPassword } from "../controllers/auth.resetPassword";
import { viewProfile } from "../controllers/auth.viewProfile";
import { verify_token } from "../helpers/jwtverify";
import { updateProfile } from "../controllers/auth.updateProfile";
import { verifyPhone } from "../controllers/auth.verifyPhone";
import { updatePhoneNo } from "../controllers/auth.updatePhone";
import { updateEmail } from "../controllers/auth.updateEmail";
import { verifyNewEmail } from "../controllers/auth.verifyEmail";
import { authenticator } from "../controllers/auth.authenticator";
const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/forgetPassword", forgetPassword);
router.post("/resetPassword", resetPassword);
router.post("/verify-phone", verifyPhone);
router.post("/verifyNewEmail", verifyNewEmail);
router.post("/authenticator", authenticator);

// Secured Routes

router.get("/viewProfile", verify_token, viewProfile);
router.patch("/updateProfile", verify_token, updateProfile);
router.patch("/updatePhoneNo", verify_token, updatePhoneNo);
router.patch("/updateEmail", verify_token, updateEmail);

export default router;
