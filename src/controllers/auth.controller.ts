import { Request, Response } from "express"; // Import Request and Response types
import userService from "../service/user.service"; // Ensure the userService is exported correctly
import emailService from "../utils/email"; // Ensure the emailService is exported correctly
import { sendOTPToUser } from "../utils/otp";
import {
  CreateUserResponse,
  UserServiceResponse,
} from "../types/ResponseTypes";

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

      const userId = (response as CreateUserResponse).user.id;

      // Await the OTP generation and sending process
      const otp = await sendOTPToUser(userId); // Now resolves to a string
      if (!otp) {
        // Handle the error case where OTP could not be sent
        return res.status(500).json({ message: "Failed to send OTP" });
      }

      // Prepare the email data
      const data = {
        subject: "Student information system validation",
        username: fullName,
        OTP: otp, // This is now a string
      };

      // Await the email sending process
      await emailService.sendEmailWithTemplate(email, data);

      // Return successful response
      return res.status(response.statusCode).send(response);
    } catch (err) {
      console.error("Signup error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  //validate otp
  async validateOTP(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { OTP } = req.body;
    try {
      const response: UserServiceResponse | any = await userService.validateOTP(
        id,
        OTP
      );
      return res.status(response.statusCode).send(response);
    } catch (error) {
      console.error("Validate OTP error:", error);
      return res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  async RequestOTP(req: Request, res: Response): Promise<Response> {
    const { id, fullName, email } = req.body;
    try {
      // Await the OTP generation and sending process
      const otp = await sendOTPToUser(id); // Now resolves to a string
      if (!otp) {
        // Handle the error case where OTP could not be sent
        return res.status(500).json({ message: "Failed to send OTP" });
      }
      const data = {
        subject: "Student information system validation",
        username: fullName,
        OTP: otp, // This is now a string
      };

      await emailService.sendEmailWithTemplate(email, data);

      // Return successful response
      return res.status(200).json({ message: "OTP sent to User" });
    } catch (error) {
      console.error("Request OTP error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default new AuthController(); // Use ES module syntax to export
