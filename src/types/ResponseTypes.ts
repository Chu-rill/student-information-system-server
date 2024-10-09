import { EnrollmentDocument, UserDocument } from "./DBTypes";

//User response
export type LoginResponse = {
  status: string;
  error: boolean;
  statusCode: number;
  data: { username: string; id: string };
  token?: string;
};
export type User = {
  username: string;
  email: string;
};
export type CreateUserResponse = {
  status: string;
  error: boolean;
  statusCode: number;
  data: {
    id: string;
    fullName: string;
    email: string;
    major: string;
    role: string;
  };
};

export type DeleteUserResponse = {
  status: string;
  error: boolean;
  statusCode: number;
  message: string;
};

export type GetUserResponse = {
  status: string;
  error: boolean;
  statusCode: number;
  message: string;
  data?: UserDocument | null;
};

export type UserServiceResponse = {
  status: string;
  statusCode: number;
  message?: string;
  data?: any;
  error?: boolean;
};

//Enrollment response
export type CreateEnrollmentResponse = {
  status: string;
  error: boolean;
  statusCode: number;
  data: {
    id: string;
    enrollmentDate: Date;
    status: string;
    student: {
      id: string;
      fullName: string;
      major: string;
    };
    course: {
      id: string;
      courseName: string;
      courseDescription: string;
    };
  };
};

export type DeleteEnrollmentResponse = {
  status: string;
  error: boolean;
  statusCode: number;
  message: string;
};

export type GetEnrollmentResponse = {
  status: string;
  error: boolean;
  statusCode: number;
  message: string;
  data?: EnrollmentDocument | null;
};

export type EnrollmentServiceResponse = {
  status: string;
  error?: boolean;
  statusCode?: number;
  message?: string;
  data?: any;
};
