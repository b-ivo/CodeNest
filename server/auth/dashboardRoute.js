import express from "express";
import { authenticate, authorizeRoles } from "../middleware/authenticate.js";
const router = express.Router();

router.get("/dashboard", authenticate, authorizeRoles("teacher"), (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  return res.status(200).json({ message: "Welcome back!", user: req.user });
});

export default router;
