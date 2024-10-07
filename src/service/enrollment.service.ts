import enrollmentRepository from "../repositories/enrollment.repository";

class EnrollmentService {
  // Fetch all enrollments
  async getAllEnrollments() {
    return await enrollmentRepository.findAll();
  }

  // Fetch a single enrollment by ID
  async getEnrollment(id: string) {
    return await enrollmentRepository.findById(id);
  }

  // Create a new enrollment
  async createEnrollment(enrollmentData: any) {
    return await enrollmentRepository.create(enrollmentData);
  }

  // Update an existing enrollment
  async updateEnrollment(id: string, enrollmentData: any) {
    return await enrollmentRepository.update(id, enrollmentData);
  }

  // Delete an enrollment by ID
  async deleteEnrollment(id: string) {
    return await enrollmentRepository.delete(id);
  }
}
export default new EnrollmentService();
