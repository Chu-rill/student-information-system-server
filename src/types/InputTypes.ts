import { User as PrismaUser, Role, Enrollment } from "@prisma/client";
interface UserDocument extends PrismaUser {
  id: string;
  fullName: string;
  email: string;
  password: string;
  dateOfBirth: Date;
  phoneNumber: string;
  enrollmentDate: Date;
  major: string;
  isVerified: boolean;
  role: Role; // Should use Role enum type, not string
  enrollments: Enrollment[]; // Adjust this to the appropriate type if necessary
}

// Prisma update input for enrollments
interface UserUpdateInput {
  fullName?: string;
  email?: string;
  password?: string;
  dateOfBirth?: Date;
  phoneNumber?: string;
  enrollmentDate?: Date;
  otp?: string | null;
  otpExpiration?: Date | null;
  major?: string;
  isVerified?: boolean;
  role?: Role;
  enrollments?: {
    create?: Enrollment[];
    connect?: { id: string }[];
    disconnect?: { id: string }[];
  };
}

export { UserDocument, UserUpdateInput };
