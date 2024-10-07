import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class EnrollmentRepository {
  // Find all enrollments
  async findAll() {
    return await prisma.enrollment.findMany({
      include: {
        student: true, // Include the related student (User)
        course: true, // Include the related course
      },
    });
  }

  // Find enrollment by ID
  async findById(id: string) {
    return await prisma.enrollment.findUnique({
      where: { id },
      include: {
        student: true,
        course: true,
      },
    });
  }

  // Create a new enrollment
  async create(enrollmentData: any) {
    return await prisma.enrollment.create({
      data: enrollmentData,
    });
  }

  // Update an enrollment by ID
  async update(id: string, enrollmentData: any) {
    return await prisma.enrollment.update({
      where: { id },
      data: enrollmentData,
    });
  }

  // Delete an enrollment by ID
  async delete(id: string) {
    return await prisma.enrollment.delete({
      where: { id },
    });
  }
}
export default new EnrollmentRepository();
