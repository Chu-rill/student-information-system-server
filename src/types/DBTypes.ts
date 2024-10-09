import {
  User as PrismaUser,
  Role,
  Enrollment,
  EnrollmentStatus,
  Grade,
} from "@prisma/client";
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
  role: Role;
  enrollments: Enrollment[];
}

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
interface EnrollmentDocument extends Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrollmentDate: Date;
  status: EnrollmentStatus;
  grades: Grade[];
  student: {
    id: string;
    fullName: string;
    email: string;
    major: string;
  };
  course: {
    id: string;
    courseName: string;
    courseDescription: string;
    department: string;
    credits: number;
  };
}
interface EnrollmentUpdateInput {
  status?: EnrollmentStatus;
}

export {
  UserDocument,
  UserUpdateInput,
  EnrollmentDocument,
  EnrollmentUpdateInput,
};
