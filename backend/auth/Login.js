import express from "express";
import bcrypt from "bcryptjs";
import User from "../schema/User.js";
import generateToken from "../util/generatetoken.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

 const token = generateToken(user)

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 2 * 24 * 60 * 60 * 1000,
      sameSite: "Lax",
    });

    res.status(200).json({
      message: "Logged in successfully",
      token,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.error(err);
    console.log(err.message);
    return res.status(500).json({ message: err.message });
  }
});

export default router;
