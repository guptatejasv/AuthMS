import { Router } from "express";
import { signup } from "./../controllers/auth.signup";
import { signin } from "./../controllers/auth.signin";
import { forgetPassword } from "../controllers/auth.forgetPassword";
import { resetPassword } from "../controllers/auth.resetPassword";
const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/forgetPassword", forgetPassword);
router.post("/resetPassword", resetPassword);

export default router;
