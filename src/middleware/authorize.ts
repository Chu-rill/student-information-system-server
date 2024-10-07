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

      // Fetch the user from the database
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
          isVerified: true, // Ensure this field is true
        },
      });

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Check if the user is verified
      if (!req.user.isVerified) {
        return res
          .status(403)
          .json({ message: "Access denied. User not verified." });
      }

      // Proceed to the next middleware
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Token verification failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === "ADMIN") {
    next(); // User is an admin, continue to the next middleware or route handler
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
};

const authorizeChange = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params; // Assumes the user ID is in the URL params (could also be in req.body)

  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  // Check if the ID in the token matches the ID in the request params/body
  if (req.user.id !== id) {
    return res
      .status(403)
      .json({
        message: "Access denied. You can only update your own account.",
      });
  }

  // If IDs match, proceed to the next middleware
  next();
};

export { protect, isAdmin, authorizeChange };
