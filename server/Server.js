import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./model/ConnectDB.js";
import signupRoute from "./auth/Signup.js";
import loginRoute from "./auth/Login.js";
import cors from "cors";
import dashboardRoute from "./auth/dashboardRoute.js";
import cookieParser from "cookie-parser";
import Logout from "./auth/Logout.js";
import addcourse from "./routes/courseroute.js"
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
app.use("/api/auth", signupRoute);
app.use("/api/auth", loginRoute);
app.use("/api", dashboardRoute);
app.use("/api", addcourse)
app.use("/api/auth", Logout);

connectDB();

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`I am running on ${PORT}`);
  });
}

export default app;
