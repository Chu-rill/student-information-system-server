import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await prisma.user.findUnique({
        where: {
          id: decoded.id, // Ensure this matches the token payload
        },
        select: {
          id: true,
          fullName: true,
          email: true,
          dateOfBirth: true,
          phoneNumber: true,
          major: true,
          role: true,
          // Exclude password
        },
      });
      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Token verification failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};
export { protect };
