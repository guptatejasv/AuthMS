import { Router } from "express";
import { signup } from "./../controllers/auth.signup";
import { signin } from "./../controllers/auth.signin";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);

export default router;
