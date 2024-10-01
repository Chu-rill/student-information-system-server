import { Request, Response } from "express"; // Import Request and Response types
import userService from "../service/user.service"; // Ensure the userService is exported correctly
import emailService from "../utils/email"; // Ensure the emailService is exported correctly

class AuthController {
  async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;
    try {
      const response = await userService.loginUser(email, password);
      return res.status(response.statusCode).send(response);
    } catch (err) {
      console.error("Login error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async signup(req: Request, res: Response): Promise<Response> {
    const { fullName, password, email, dateOfBirth, phoneNumber, major, role } =
      req.body;
    try {
      const response = await userService.createUser(
        fullName,
        password,
        email,
        new Date(dateOfBirth),
        phoneNumber,
        major,
        role
      );
      if (response.error) {
        return res.status(response.statusCode).json(response);
      }

      const data = {
        subject: "Welcome to Express Template",
        username: fullName,
      };
      await emailService.sendEmailWithTemplate(email, data);
      return res.status(response.statusCode).send(response);
    } catch (err) {
      console.error("Signup error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default new AuthController(); // Use ES module syntax to export
