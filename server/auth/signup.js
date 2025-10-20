import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../model/User.js";
import {authorize, authenticate} from '../middleware/authenticate.js'

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { email, username, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new User({
      email,
      username,
      password: hashedPassword,
      role,
    });
    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
      maxAge: 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "Signup successful",
      user: {
        id: newUser._id,
        email: newUser.email,
        username: newUser.username,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/teacher/dashboard", authenticate, authorize(["teacher"]), (req, res) => {
  res.json({ message: `Welcome Teacher ${req.user.id}` });
});

router.get("/student/dashboard", authenticate, authorize(["student"]), (req, res) => {
  res.json({ message: `Welcome Student ${req.user.id}` });
});

export default router;