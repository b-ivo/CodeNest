import express from "express";
import Course from "../schema/AddCourse.js";
import { authenticate } from "../middleware/authenticate.js";
const router = express.Router();

router.post("/addcourse", authenticate, async (req, res) => {
  try {
    const { courseName, category, classLevel, periods } = req.body;
    const teacherId = req.user.id;

    if (!courseName || !category || !classLevel || !periods) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newCourse = new Course({
      courseName,
      category,
      classLevel,
      periods,
      teacherId,
    });
    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    console.error("Error adding course:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/allcourse", authenticate, async (req, res) => {
  try {
    const courses = await Course.find({ teacherId: req.user.id });
    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
