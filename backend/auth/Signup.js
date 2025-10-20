import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "./../schema/User.js";
import generateToken from "../util/generatetoken.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      name,
      password: hashedPassword,
    });
    await user.save();

    const token = generateToken(user)

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });
    console.log(token);
    
    return res.status(201).json({
      message: "User created successfully",
      token,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
