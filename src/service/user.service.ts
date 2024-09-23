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

interface User {
  username: string;
  email: string;
}

interface LoginResponse {
  status: string;
  error: boolean;
  statusCode: number;
  user: { username: string; id: string };
  token?: string;
}

interface CreateUserResponse {
  status: string;
  error: boolean;
  statusCode: number;
  user: { username: string; email: string };
}

interface DeleteUserResponse {
  status: string;
  error: boolean;
  statusCode: number;
  message: string;
}

interface GetUserResponse {
  status: string;
  error: boolean;
  statusCode: number;
  message: string;
  data?: User | null;
}

class UserService {
  async loginUser(
    username: string,
    password: string
  ): Promise<
    | LoginResponse
    | typeof doesNotExistError
    | typeof passwordMismatchError
    | typeof defaultError
  > {
    try {
      const user = await userRepository.getUserByUsername(username);
      if (!user) return doesNotExistError;

      const isPasswordCorrect = await comparePassword(password, user.password);
      if (!isPasswordCorrect) return passwordMismatchError;

      const payload = { username: user.username, id: user._id };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME,
      });

      return {
        status: "success",
        error: false,
        statusCode: httpStatus.OK,
        user: { username: user.username, id: user._id },
        token,
      };
    } catch (error) {
      console.error(error);
      return defaultError(error);
    }
  }

  async createUser(
    username: string,
    password: string,
    email: string
  ): Promise<
    CreateUserResponse | typeof noDuplicateError | typeof defaultError
  > {
    try {
      const existingUser = await userRepository.getUserByUsername(username);
      if (existingUser) return noDuplicateError;

      const hashedPassword = await encrypt(password);
      const user = await userRepository.createUser({
        username,
        password: hashedPassword,
        email,
      });

      if (!user) return defaultError;

      return {
        status: "success",
        error: false,
        statusCode: httpStatus.CREATED,
        user: { username, email },
      };
    } catch (error) {
      console.error(error);
      return defaultError(error);
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
      return defaultError(error);
    }
  }

  async getAllUsers(): Promise<{
    status: string;
    error: boolean;
    statusCode: number;
    message: string;
    data?: User[];
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
      return defaultError(error);
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
      return defaultError(error);
    }
  }

  async updateUser(
    id: string,
    updateData: Partial<User>
  ): Promise<
    | {
        status: string;
        error: boolean;
        statusCode: number;
        message: string;
        data?: User;
      }
    | { status: string; message: string }
  > {
    try {
      const user = await userRepository.findById(id);

      // Check if the user exists
      if (!user) {
        return {
          status: "error",
          statusCode: 404,
          message: "No user found.",
        };
      }

      // Update the user details
      const updatedUser = await userRepository.update(id, updateData);

      if (!updatedUser) {
        return {
          status: "error",
          statusCode: 400,
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
      return defaultError(error);
    }
  }
}

export default new UserService();