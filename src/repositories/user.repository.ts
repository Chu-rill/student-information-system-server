import {
  PrismaClient,
  User as PrismaUser,
  Role,
  Enrollment,
} from "@prisma/client";
const prisma = new PrismaClient();
import { UserDocument, UserUpdateInput } from "../types/InputTypes";
// Define the interface for the user data

class UserRepository {
  // Find all users
  async findAll(): Promise<UserDocument[]> {
    const users = await prisma.user.findMany({
      include: { enrollments: true }, // Include related enrollments if needed
    });
    return users as UserDocument[];
  }

  // Find user by ID
  async findById(id: string): Promise<UserDocument | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { enrollments: true }, // Ensure enrollments are fetched
    });
    return user as UserDocument | null;
  }

  // Create a new user
  async createUser({
    fullName,
    email,
    password,
    dateOfBirth,
    phoneNumber,
    enrollmentDate,
    major,
    role,
    verificationToken,
  }: {
    fullName: string;
    email: string;
    password: string;
    dateOfBirth: Date;
    phoneNumber: string;
    enrollmentDate: Date;
    major: string;
    role: Role;
    verificationToken: string;
  }): Promise<UserDocument> {
    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        password,
        dateOfBirth,
        phoneNumber,
        enrollmentDate,
        major,
        role,
        verificationToken,
      },
    });
    return user as UserDocument;
  }

  // Update a user by ID, including nested enrollments
  async update(
    id: string,
    updatedUser: Partial<UserUpdateInput>
  ): Promise<UserDocument | null> {
    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...updatedUser,
        enrollments: updatedUser.enrollments
          ? {
              create: updatedUser.enrollments?.create,
              connect: updatedUser.enrollments?.connect,
              disconnect: updatedUser.enrollments?.disconnect,
            }
          : undefined,
      },
      include: { enrollments: true }, // Optionally include enrollments
    });
    return updated as UserDocument;
  }

  // Delete a user by ID
  async delete(id: string): Promise<UserDocument | null> {
    const user = await prisma.user.delete({
      where: { id },
    });
    return user as UserDocument;
  }

  // Find user by email
  async findByEmail(email: string): Promise<UserDocument | null> {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { enrollments: true },
    });
    return user as UserDocument | null;
  }
}

export default new UserRepository();
