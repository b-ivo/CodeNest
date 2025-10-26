import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./model/ConnectDB.js";
import signupRoute from "./auth/Signup.js";
import loginRoute from "./auth/Login.js";
import cors from "cors";
import dashboardRoute from "./auth/dashboardRoute.js";
import cookieParser from "cookie-parser";
import Logout from "./auth/Logout.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", signupRoute);
app.use("/api/auth", loginRoute);
app.use("/api", dashboardRoute);
app.use("/api/auth", Logout);

connectDB();

app.listen(PORT, () => {
  console.log(`I am running on ${PORT}`);
});
