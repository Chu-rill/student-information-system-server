import express from "express";
import { enrollmentController } from "../controllers/enrollment.controller";
import { authorizeChange, protect } from "../middleware/authorize"; // Optional if you want to protect routes

const router = express.Router();

// Define enrollment-related routes
router.get("/", protect, enrollmentController.getAllEnrollments); // Get all enrollments
router.get("/:id", protect, enrollmentController.getEnrollment); // Get a single enrollment by id
router.post("/", protect, enrollmentController.createEnrollment); // Create a new enrollment
router.put(
  "/:id",
  protect,
  authorizeChange,
  enrollmentController.updateEnrollment
); // Update an enrollment
router.delete(
  "/:id",
  protect,
  authorizeChange,
  enrollmentController.deleteEnrollment
); // Delete an enrollment

export default router;
