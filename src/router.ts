import { Router } from "express";
import { body } from "express-validator";
import { createAccount, getUser, login } from "./handlers";
import { handleInputErrors } from "./middleware/validation";
import { authenticate } from "./middleware/auth";

const router = Router();

router.post(
  "/auth/register",
  body("handle").notEmpty().withMessage("Handle is required"),
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Email is invalid"),
  body("password")
    .isLength({ min: 8 })
    .trim()
    .withMessage("Password is too short, minimum 8 characters"),
  handleInputErrors,
  createAccount
);

router.post(
  "/auth/login",
  body("email").isEmail().withMessage("Email is invalid"),
  body("password").notEmpty().trim().withMessage("Password is required"),
  handleInputErrors,
  login
);

router.get("/user", authenticate, getUser);
export default router;
