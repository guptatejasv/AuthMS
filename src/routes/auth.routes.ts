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
const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/forgetPassword", forgetPassword);
router.post("/resetPassword", resetPassword);
router.post("/verify-phone", verifyPhone);

// Secured Routes

router.get("/viewProfile", verify_token, viewProfile);
router.patch("/updateProfile", verify_token, updateProfile);
router.patch("/updatePhoneNo/:id", verify_token, updatePhoneNo);

export default router;
