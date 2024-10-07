import { Request, Response } from "express";
import enrollmentService from "../service/enrollment.service";

export const enrollmentController = {
  // Get all enrollments
  async getAllEnrollments(req: Request, res: Response): Promise<Response> {
    try {
      const enrollments = await enrollmentService.getAllEnrollments();
      return res.status(200).json({ status: "success", data: enrollments });
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      return res.status(500).json({ status: "error", message: "Server error" });
    }
  },

  // Get a single enrollment by ID
  async getEnrollment(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    try {
      const enrollment = await enrollmentService.getEnrollment(id);
      if (!enrollment) {
        return res
          .status(404)
          .json({ status: "error", message: "Enrollment not found" });
      }
      return res.status(200).json({ status: "success", data: enrollment });
    } catch (error) {
      console.error("Error fetching enrollment:", error);
      return res.status(500).json({ status: "error", message: "Server error" });
    }
  },

  // Create a new enrollment
  async createEnrollment(req: Request, res: Response): Promise<Response> {
    try {
      const enrollmentData = req.body; // Validate your input
      const newEnrollment = await enrollmentService.createEnrollment(
        enrollmentData
      );
      return res.status(201).json({ status: "success", data: newEnrollment });
    } catch (error) {
      console.error("Error creating enrollment:", error);
      return res.status(500).json({ status: "error", message: "Server error" });
    }
  },

  // Update an enrollment by ID
  async updateEnrollment(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const enrollmentData = req.body;

    try {
      const updatedEnrollment = await enrollmentService.updateEnrollment(
        id,
        enrollmentData
      );
      if (!updatedEnrollment) {
        return res
          .status(404)
          .json({ status: "error", message: "Enrollment not found" });
      }
      return res
        .status(200)
        .json({ status: "success", data: updatedEnrollment });
    } catch (error) {
      console.error("Error updating enrollment:", error);
      return res.status(500).json({ status: "error", message: "Server error" });
    }
  },

  // Delete an enrollment by ID
  async deleteEnrollment(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    try {
      const result = await enrollmentService.deleteEnrollment(id);
      if (!result) {
        return res
          .status(404)
          .json({ status: "error", message: "Enrollment not found" });
      }
      return res
        .status(200)
        .json({ status: "success", message: "Enrollment deleted" });
    } catch (error) {
      console.error("Error deleting enrollment:", error);
      return res.status(500).json({ status: "error", message: "Server error" });
    }
  },
};
