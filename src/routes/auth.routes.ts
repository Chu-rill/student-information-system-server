import { Router } from "express";
import authController from "../controllers/auth.controller";
import {
  login_query_validator,
  register_query_validator,
} from "../validation/auth.validation";
import { validateSchema } from "../middleware/ValidationMiddleware";
import { protect } from "../middleware/jwt";
const authRoutes = Router();

authRoutes.post(
  "/signup",
  validateSchema(register_query_validator), // Use the named import
  authController.signup
);

authRoutes.post(
  "/login",
  validateSchema(login_query_validator), // Use the named import
  authController.login
);
authRoutes.post("/validate-otp", protect, authController.validateOTP);

export default authRoutes;
