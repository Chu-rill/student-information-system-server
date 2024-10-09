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

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify the token and decode its payload
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
        id: string;
      };

      // Fetch the user from the database
      const user = await prisma.user.findUnique({
        where: {
          id: decoded.id,
        },
        select: {
          id: true,
          fullName: true,
          email: true,
          dateOfBirth: true,
          phoneNumber: true,
          major: true,
          role: true,
          isVerified: true,
        },
      });

      // If no user is found, return unauthorized
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Check if the user is verified
      if (!user.isVerified) {
        return res
          .status(403)
          .json({ message: "Access denied. User not verified." });
      }

      // Check if the user is an admin
      if (user.role !== "ADMIN") {
        return res.status(403).json({ message: "Access denied. Admins only." });
      }

      // If all checks pass, proceed to the next middleware
      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  } else {
    return res.status(401).json({ message: "No token provided" });
  }
};

const authorizeChange = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token;

  // Check for authorization header and extract token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify the token and decode its payload
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
        id: string;
      };

      // Fetch the user from the database based on decoded token id
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          fullName: true,
          email: true,
          dateOfBirth: true,
          phoneNumber: true,
          major: true,
          role: true,
          isVerified: true,
        },
      });

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Attach user to the request
      req.user = user;

      const { id } = req.params; // Assuming the user ID to check is in the params

      // Check if the logged-in user's ID matches the ID in the request
      if (req.user.id !== id) {
        return res.status(403).json({
          message: "Access denied. You can only update your own account.",
        });
      }

      // If all checks pass, proceed to the next middleware
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  } else {
    return res.status(401).json({ message: "No token provided" });
  }
};

export { protect, isAdmin, authorizeChange };
