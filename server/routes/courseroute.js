import express from "express";
import Course from "../schema/AddCourse.js";
import Enrollment from "../schema/Enrollment.js";
import { authenticate, authorizeRoles } from "../middleware/authenticate.js";
const router = express.Router();

// Teacher: Add course
router.post("/addcourse", authenticate, authorizeRoles("teacher"), async (req, res) => {
  try {
    const { courseName, category, classLevel, periods, description } = req.body;
    const teacherId = req.user.id;

    if (!courseName || !category || !classLevel || !periods) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newCourse = new Course({
      courseName,
      category,
      classLevel,
      periods,
      description: description || '',
      teacherId,
    });
    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    console.error("Error adding course:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Teacher: Get their courses
router.get("/teacher/courses", authenticate, authorizeRoles("teacher"), async (req, res) => {
  try {
    const courses = await Course.find({ teacherId: req.user.id })
      .populate('teacherId', 'name email')
      .sort({ createdAt: -1 });
    
    // Get enrollment count for each course
    const coursesWithStats = await Promise.all(
      courses.map(async (course) => {
        const enrollmentCount = await Enrollment.countDocuments({ 
          courseId: course._id, 
          status: 'active' 
        });
        return {
          ...course.toObject(),
          enrollmentCount
        };
      })
    );
    
    res.status(200).json(coursesWithStats);
  } catch (error) {
    console.error("Error fetching courses: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Student: Get available courses to enroll
router.get("/available-courses", authenticate, authorizeRoles("student"), async (req, res) => {
  try {
    const studentId = req.user.id;
    
    // Get courses student is not enrolled in
    const enrolledCourses = await Enrollment.find({ studentId }).select('courseId');
    const enrolledCourseIds = enrolledCourses.map(e => e.courseId);
    
    const availableCourses = await Course.find({
      _id: { $nin: enrolledCourseIds }
    }).populate('teacherId', 'name email').sort({ createdAt: -1 });
    
    res.status(200).json(availableCourses);
  } catch (error) {
    console.error("Error fetching available courses: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Student: Get enrolled courses
router.get("/student/courses", authenticate, authorizeRoles("student"), async (req, res) => {
  try {
    const studentId = req.user.id;
    
    const enrollments = await Enrollment.find({ 
      studentId, 
      status: 'active' 
    })
    .populate({
      path: 'courseId',
      populate: {
        path: 'teacherId',
        select: 'name email'
      }
    })
    .sort({ enrolledAt: -1 });
    
    const courses = enrollments.map(enrollment => ({
      ...enrollment.courseId.toObject(),
      enrollmentId: enrollment._id,
      progress: enrollment.progress,
      enrolledAt: enrollment.enrolledAt
    }));
    
    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching student courses: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Student: Enroll in course
router.post("/enroll/:courseId", authenticate, authorizeRoles("student"), async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;
    
    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    
    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({ studentId, courseId });
    if (existingEnrollment) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }
    
    const enrollment = new Enrollment({ studentId, courseId });
    await enrollment.save();
    
    res.status(201).json({ message: "Successfully enrolled in course", enrollment });
  } catch (error) {
    console.error("Error enrolling in course: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all courses (for both roles with different data)
router.get("/allcourse", authenticate, async (req, res) => {
  try {
    if (req.user.role === 'teacher') {
      // Redirect to teacher-specific route
      return res.redirect('/api/teacher/courses');
    } else {
      // Redirect to student-specific route  
      return res.redirect('/api/student/courses');
    }
  } catch (error) {
    console.error("Error fetching courses: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get single course details
router.get("/course/:id", authenticate, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('teacherId', 'name email');
    
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    
    // Add enrollment info for students
    if (req.user.role === 'student') {
      const enrollment = await Enrollment.findOne({
        studentId: req.user.id,
        courseId: course._id
      });
      
      return res.json({
        ...course.toObject(),
        isEnrolled: !!enrollment,
        enrollment: enrollment || null
      });
    }
    
    // Add enrollment count for teachers
    if (req.user.role === 'teacher') {
      const enrollmentCount = await Enrollment.countDocuments({
        courseId: course._id,
        status: 'active'
      });
      
      return res.json({
        ...course.toObject(),
        enrollmentCount
      });
    }
    
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
