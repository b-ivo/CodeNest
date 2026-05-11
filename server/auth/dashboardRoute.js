import express from "express";
import { authenticate, authorizeRoles } from "../middleware/authenticate.js";
import Course from "../schema/AddCourse.js";
import Assignment from "../schema/Assignment.js";
import Submission from "../schema/Submission.js";
import Enrollment from "../schema/Enrollment.js";
import User from "../schema/User.js";
const router = express.Router();

// Universal dashboard route that works for both roles
router.get("/dashboard", authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;
    const userRole = req.user.role;

    let dashboardData = {
      user: req.user,
      role: userRole
    };

    if (userRole === 'teacher') {
      // Teacher dashboard data
      const courseCount = await Course.countDocuments({ teacherId: userId });
      const assignmentCount = await Assignment.countDocuments({ teacherId: userId });
      
      // Get recent assignments
      const recentAssignments = await Assignment.find({ teacherId: userId })
        .populate('courseId', 'courseName')
        .sort({ createdAt: -1 })
        .limit(5);

      // Get submission statistics
      const totalSubmissions = await Submission.countDocuments({
        assignmentId: { $in: await Assignment.find({ teacherId: userId }).select('_id') }
      });

      const pendingGrading = await Submission.countDocuments({
        assignmentId: { $in: await Assignment.find({ teacherId: userId }).select('_id') },
        status: 'submitted'
      });

      dashboardData.stats = {
        courseCount,
        assignmentCount,
        totalSubmissions,
        pendingGrading
      };
      dashboardData.recentAssignments = recentAssignments;

    } else if (userRole === 'student') {
      // Student dashboard data
      const enrollmentCount = await Enrollment.countDocuments({ 
        studentId: userId, 
        status: 'active' 
      });

      // Get enrolled course IDs
      const enrollments = await Enrollment.find({ 
        studentId: userId, 
        status: 'active' 
      }).select('courseId');
      const courseIds = enrollments.map(e => e.courseId);

      // Get pending assignments
      const pendingAssignments = await Assignment.find({
        courseId: { $in: courseIds },
        status: 'published',
        dueDate: { $gte: new Date() }
      })
      .populate('courseId', 'courseName')
      .sort({ dueDate: 1 })
      .limit(5);

      // Filter out already submitted assignments
      const pendingAssignmentsFiltered = [];
      for (const assignment of pendingAssignments) {
        const submission = await Submission.findOne({
          assignmentId: assignment._id,
          studentId: userId
        });
        if (!submission) {
          pendingAssignmentsFiltered.push(assignment);
        }
      }

      // Get recent grades
      const recentGrades = await Submission.find({
        studentId: userId,
        status: 'graded'
      })
      .populate({
        path: 'assignmentId',
        populate: {
          path: 'courseId',
          select: 'courseName'
        }
      })
      .sort({ gradedAt: -1 })
      .limit(5);

      const submissionCount = await Submission.countDocuments({ studentId: userId });
      const gradedCount = await Submission.countDocuments({ 
        studentId: userId, 
        status: 'graded' 
      });

      dashboardData.stats = {
        enrollmentCount,
        pendingAssignments: pendingAssignmentsFiltered.length,
        submissionCount,
        gradedCount
      };
      dashboardData.pendingAssignments = pendingAssignmentsFiltered;
      dashboardData.recentGrades = recentGrades;
    }

    return res.status(200).json(dashboardData);
  } catch (error) {
    console.error('Dashboard error:', error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// PUT /api/profile — update display name
router.put("/profile", authenticate, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ message: "Name must be at least 2 characters" });
    }
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { name: name.trim() },
      { new: true, select: "-password" }
    );
    res.json({ message: "Profile updated", name: updated.name });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /api/profile/activity — recent activity feed
router.get("/profile/activity", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    let activity = [];

    if (userRole === "teacher") {
      const courses = await Course.find({ teacherId: userId }).sort({ createdAt: -1 }).limit(5).select("courseName createdAt");
      const assignments = await Assignment.find({ teacherId: userId }).sort({ createdAt: -1 }).limit(5).populate("courseId", "courseName").select("title createdAt courseId");
      const teacherAssignmentIds = await Assignment.find({ teacherId: userId }).select("_id");
      const submissions = await Submission.find({ assignmentId: { $in: teacherAssignmentIds } })
        .sort({ submittedAt: -1 }).limit(5)
        .populate("studentId", "name").populate("assignmentId", "title");

      activity = [
        ...courses.map(c => ({ type: "course_created", title: `Created course: ${c.courseName}`, date: c.createdAt })),
        ...assignments.map(a => ({ type: "assignment_created", title: `Created assignment: ${a.title}`, subtitle: a.courseId?.courseName, date: a.createdAt })),
        ...submissions.map(s => ({ type: "submission_received", title: `${s.studentId?.name} submitted: ${s.assignmentId?.title}`, date: s.submittedAt })),
      ];
    } else {
      const enrollments = await Enrollment.find({ studentId: userId }).sort({ enrolledAt: -1 }).limit(5).populate("courseId", "courseName");
      const submissions = await Submission.find({ studentId: userId }).sort({ submittedAt: -1 }).limit(5).populate("assignmentId", "title");
      const grades = await Submission.find({ studentId: userId, status: "graded" }).sort({ gradedAt: -1 }).limit(5).populate("assignmentId", "title");

      activity = [
        ...enrollments.map(e => ({ type: "enrolled", title: `Enrolled in: ${e.courseId?.courseName}`, date: e.enrolledAt })),
        ...submissions.map(s => ({ type: "submitted", title: `Submitted: ${s.assignmentId?.title}`, date: s.submittedAt })),
        ...grades.map(g => ({ type: "graded", title: `Grade received: ${g.grade}% on ${g.assignmentId?.title}`, date: g.gradedAt })),
      ];
    }

    activity.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(activity.slice(0, 10));
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
