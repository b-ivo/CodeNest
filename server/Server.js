import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./model/ConnectDB.js";
import signupRoute from "./auth/Signup.js";
import loginRoute from "./auth/Login.js";
import cors from "cors";
import dashboardRoute from "./auth/dashboardRoute.js";
import cookieParser from "cookie-parser";
import Logout from "./auth/Logout.js";
import courseRoutes from "./routes/courseroute.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: true, // Allow all origins in production or configure specifically
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Ensure DB is connected before handling any requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ message: "Database connection failed" });
  }
});

// Routes
app.use("/api/auth", signupRoute);
app.use("/api/auth", loginRoute);
app.use("/api/auth", Logout);
app.use("/api", dashboardRoute);
app.use("/api", courseRoutes);
app.use("/api", assignmentRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "CodeNest API is running" });
});

// Initial connection attempt for logging
connectDB();

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`CodeNest Server running on port ${PORT}`);
  });
}

export default app;
