import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import enrollmentRoutes from "./routes/enrollment.routes";
import courseRoutes from "./routes/course.routes";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000; // Provide a fallback port in case PORT is undefined

// Set up the rate limiter to allow 100 requests per hour
const limiter = rateLimit({
  max: 100, // 100 requests
  windowMs: 60 * 60 * 1000, // 1 hour
  message:
    "We have received too many requests from this IP. Please try again after one hour.",
});

// Middleware setup
app.use(
  cors({
    origin: process.env.ALLOWED_URL || "*", // Your frontend URL, default to *
    methods: "*",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  })
);
app.use(express.json());
app.use(helmet());
app.use(limiter);
app.use(morgan("common"));
app.use(express.urlencoded({ extended: false }));

// Routes
app.get("/", async (req: Request, res: Response) => {
  res.json({ success: true, message: "Backend Connected Successfully" });
});

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/enroll", enrollmentRoutes);
app.use("/api/v1/course", courseRoutes);

// Start server and connect to the database
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
