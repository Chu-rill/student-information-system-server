import jwt from "jsonwebtoken";
import { comparePassword, encrypt } from "../utils/encryption";
import {
  passwordMismatchError,
  doesNotExistError,
  defaultError,
  noDuplicateError,
} from "../error/error";
import httpStatus from "http-status";
import userRepository from "../repositories/user.repository";
import {
  LoginResponse,
  CreateUserResponse,
  DeleteUserResponse,
  GetUserResponse,
  User,
} from "../types/ResponseTypes";
import { Role } from "@prisma/client";
import { UserDocument, UserUpdateInput } from "../types/InputTypes";

class UserService {
  async loginUser(
    email: string,
    password: string
  ): Promise<
    | LoginResponse
    | typeof doesNotExistError
    | typeof passwordMismatchError
    | typeof defaultError
  > {
    try {
      const user = (await userRepository.findByEmail(email)) as UserDocument;
      if (!user) return doesNotExistError;
      // const hashedPassword = await encrypt(password);
      const trimmedPassword = password.trim().toLowerCase();

      const isPasswordCorrect = await comparePassword(
        trimmedPassword,
        user.password
      );

      if (!isPasswordCorrect) return passwordMismatchError;

      let { password: userPassword, ...userWithoutPassword } = user;
      const payload = {
        ...userWithoutPassword, // Spread the rest of the user properties
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_LIFETIME,
      });

      return {
        status: "success",
        error: false,
        statusCode: httpStatus.OK,
        user: { username: user.fullName, id: user.id }, // Ensure _id is a string
        token,
      };
    } catch (error) {
      console.error(error);
      return defaultError;
    }
  }

  async createUser(
    fullName: string,
    password: string,
    email: string,
    dateOfBirth: Date,
    phoneNumber: string,
    major: string,
    role: Role
  ): Promise<
    CreateUserResponse | typeof noDuplicateError | typeof defaultError
  > {
    try {
      const existingUser = await userRepository.findByEmail(email);
      if (existingUser) return noDuplicateError;
      const trimmedFullName = fullName.trim();
      const trimmedPassword = password.trim().toLowerCase();

      const hashedPassword = await encrypt(trimmedPassword);

      const user = await userRepository.createUser({
        fullName: trimmedFullName,
        password: hashedPassword,
        email,
        dateOfBirth,
        phoneNumber,
        major,
        role,
      });

      if (!user) return defaultError;

      return {
        status: "success",
        error: false,
        statusCode: httpStatus.CREATED,
        message: "Signup successful, OTP sent to your email",
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          major: user.major,
          role: user.role,
        },
      };
    } catch (error) {
      console.error(error);
      return defaultError;
    }
  }

  async deleteUser(
    id: string
  ): Promise<DeleteUserResponse | typeof doesNotExistError> {
    try {
      const user = await userRepository.delete(id);
      if (!user) return doesNotExistError;

      return {
        status: "success",
        error: false,
        statusCode: httpStatus.OK,
        message: "User deleted successfully",
      };
    } catch (error) {
      console.error(error);
      return defaultError;
    }
  }

  async getAllUsers(): Promise<{
    status: string;
    error?: boolean;
    statusCode?: number;
    message: string;
    data?: UserDocument[];
  }> {
    try {
      const users = await userRepository.findAll();
      if (!users || users.length === 0) {
        return { status: "error", message: "No users found." };
      }

      return {
        status: "success",
        error: false,
        statusCode: httpStatus.OK,
        message: "Users retrieved successfully",
        data: users,
      };
    } catch (error) {
      console.error(error);
      return defaultError;
    }
  }

  async getUser(
    id: string
  ): Promise<GetUserResponse | typeof doesNotExistError> {
    try {
      const user = await userRepository.findById(id);
      if (!user) return doesNotExistError;

      return {
        status: "success",
        error: false,
        statusCode: httpStatus.OK,
        message: "User retrieved successfully",
        data: user,
      };
    } catch (error) {
      console.error(error);
      return defaultError;
    }
  }

  async updateUser(
    id: string,
    updateData: Partial<UserUpdateInput>
  ): Promise<
    | {
        status: string;
        error: boolean;
        statusCode: number;
        message: string;
        data?: UserDocument;
      }
    | { status: string; message: string }
  > {
    try {
      const user = await userRepository.findById(id);

      if (!user) {
        return {
          status: "error",
          statusCode: httpStatus.NOT_FOUND,
          message: "No user found.",
        };
      }

      const updatedUser = await userRepository.update(id, updateData);

      if (!updatedUser) {
        return {
          status: "error",
          statusCode: httpStatus.BAD_REQUEST,
          message: "Failed to update user.",
        };
      }

      return {
        status: "success",
        error: false,
        statusCode: httpStatus.OK,
        message: "User updated successfully",
        data: updatedUser,
      };
    } catch (error) {
      console.error(error);
      return defaultError;
    }
  }
}

export default new UserService();
