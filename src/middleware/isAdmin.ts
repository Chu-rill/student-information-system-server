import { Request, Response, NextFunction } from "express";

// Middleware to check if the user is an admin
const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === "ADMIN") {
    next(); // User is an admin, continue to the next middleware or route handler
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
};

export { isAdmin };
