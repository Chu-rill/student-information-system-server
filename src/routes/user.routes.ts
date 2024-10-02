import { Router } from "express";
import userController from "../controllers/user.controller";
import { protect } from "../middleware/jwt";

const userRoutes = Router();

userRoutes.get("/users", protect, userController.getAllUsers);
userRoutes.get("/user/:id", protect, userController.getUser);
userRoutes.put("/update-user/:id", protect, userController.updateUser);
userRoutes.delete("/delete-user/:id", protect, userController.deleteUser);

export default userRoutes;
