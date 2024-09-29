// utils/randomTokenGenerator.ts
import randomatic from "randomatic";

// Function to generate a random verification token
export const generateVerificationToken = (length: number = 16): string => {
  // 'a0' means alphanumeric characters
  return randomatic("a0", length);
};
