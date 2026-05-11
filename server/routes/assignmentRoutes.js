import express from "express";
import Assignment from "../schema/Assignment.js";
import Submission from "../schema/Submission.js";
import Course from "../schema/AddCourse.js";
import Enrollment from "../schema/Enrollment.js";
import { authenticate, authorizeRoles } from "../middleware/authenticate.js";

const router = express.Router();

// Teacher: Create assignment
router.post("/assignments", authenticate, authorizeRoles("teacher"), async (req, res) => {
  try {
    const { title, description, courseId, dueDate, maxPoints, instructions } = req.body;
    const teacherId = req.user.id;

    // Verify teacher owns the course
    const course = await Course.findOne({ _id: courseId, teacherId });
    if (!course) {
      return res.status(403).json({ message: "You can only create assignments for your courses" });
    }

    const assignment = new Assignment({
      title,
      description,
      courseId,
      teacherId,
      dueDate: new Date(dueDate),
      maxPoints: maxPoints || 100,
      instructions: instructions || '',
    });

    await assignment.save();
    res.status(201).json(assignment);
  } catch (error) {
    console.error("Error creating assignment:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Teacher: Get assignments for their courses
router.get("/teacher/assignments", authenticate, authorizeRoles("teacher"), async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { courseId } = req.query;

    let query = { teacherId };
    if (courseId) {
      query.courseId = courseId;
    }

    const assignments = await Assignment.find(query)
      .populate('courseId', 'courseName')
      .sort({ createdAt: -1 });

    // Get submission counts for each assignment
    const assignmentsWithStats = await Promise.all(
      assignments.map(async (assignment) => {
        const submissionCount = await Submission.countDocuments({ 
          assignmentId: assignment._id 
        });
        const gradedCount = await Submission.countDocuments({ 
          assignmentId: assignment._id,
          status: 'graded'
        });
        
        return {
          ...assignment.toObject(),
          submissionCount,
          gradedCount
        };
      })
    );

    res.json(assignmentsWithStats);
  } catch (error) {
    console.error("Error fetching assignments:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Student: Get assignments for enrolled courses
router.get("/student/assignments", authenticate, authorizeRoles("student"), async (req, res) => {
  try {
    const studentId = req.user.id;

    // Get enrolled courses
    const enrollments = await Enrollment.find({ 
      studentId, 
      status: 'active' 
    }).select('courseId');
    
    const courseIds = enrollments.map(e => e.courseId);

    // Get assignments for enrolled courses
    const assignments = await Assignment.find({ 
      courseId: { $in: courseIds },
      status: 'published'
    })
    .populate('courseId', 'courseName')
    .populate('teacherId', 'name')
    .sort({ dueDate: 1 });

    // Check submission status for each assignment
    const assignmentsWithStatus = await Promise.all(
      assignments.map(async (assignment) => {
        const submission = await Submission.findOne({
          assignmentId: assignment._id,
          studentId
        });

        const isOverdue = new Date() > new Date(assignment.dueDate);
        
        return {
          ...assignment.toObject(),
          submission: submission || null,
          isSubmitted: !!submission,
          isOverdue,
          status: submission ? submission.status : (isOverdue ? 'overdue' : 'pending')
        };
      })
    );

    res.json(assignmentsWithStatus);
  } catch (error) {
    console.error("Error fetching student assignments:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Student: Submit assignment
router.post("/assignments/:id/submit", authenticate, authorizeRoles("student"), async (req, res) => {
  try {
    const { id: assignmentId } = req.params;
    const { content } = req.body;
    const studentId = req.user.id;

    // Verify assignment exists and student is enrolled
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    const enrollment = await Enrollment.findOne({
      studentId,
      courseId: assignment.courseId,
      status: 'active'
    });

    if (!enrollment) {
      return res.status(403).json({ message: "You are not enrolled in this course" });
    }

    // Check if already submitted
    const existingSubmission = await Submission.findOne({
      assignmentId,
      studentId
    });

    if (existingSubmission) {
      return res.status(400).json({ message: "Assignment already submitted" });
    }

    // Check if overdue
    const isOverdue = new Date() > new Date(assignment.dueDate);

    const submission = new Submission({
      assignmentId,
      studentId,
      content,
      status: isOverdue ? 'late' : 'submitted'
    });

    await submission.save();
    res.status(201).json(submission);
  } catch (error) {
    console.error("Error submitting assignment:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Teacher: Get submissions for assignment
router.get("/assignments/:id/submissions", authenticate, authorizeRoles("teacher"), async (req, res) => {
  try {
    const { id: assignmentId } = req.params;
    const teacherId = req.user.id;

    // Verify teacher owns the assignment
    const assignment = await Assignment.findOne({ _id: assignmentId, teacherId });
    if (!assignment) {
      return res.status(403).json({ message: "Assignment not found or access denied" });
    }

    const submissions = await Submission.find({ assignmentId })
      .populate('studentId', 'name email')
      .sort({ submittedAt: -1 });

    res.json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Teacher: Grade submission
router.put("/submissions/:id/grade", authenticate, authorizeRoles("teacher"), async (req, res) => {
  try {
    const { id: submissionId } = req.params;
    const { grade, feedback } = req.body;
    const teacherId = req.user.id;

    const submission = await Submission.findById(submissionId)
      .populate('assignmentId');

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // Verify teacher owns the assignment
    if (submission.assignmentId.teacherId.toString() !== teacherId) {
      return res.status(403).json({ message: "Access denied" });
    }

    submission.grade = grade;
    submission.feedback = feedback || '';
    submission.status = 'graded';
    submission.gradedAt = new Date();
    submission.gradedBy = teacherId;

    await submission.save();
    res.json(submission);
  } catch (error) {
    console.error("Error grading submission:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single assignment details
router.get("/assignments/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const assignment = await Assignment.findById(id)
      .populate('courseId', 'courseName')
      .populate('teacherId', 'name email');

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    if (userRole === 'student') {
      // Check if student is enrolled in the course
      const enrollment = await Enrollment.findOne({
        studentId: userId,
        courseId: assignment.courseId._id,
        status: 'active'
      });

      if (!enrollment) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Get student's submission if exists
      const submission = await Submission.findOne({
        assignmentId: id,
        studentId: userId
      });

      return res.json({
        ...assignment.toObject(),
        submission: submission || null,
        isSubmitted: !!submission
      });
    }

    if (userRole === 'teacher') {
      // Verify teacher owns the assignment
      if (assignment.teacherId._id.toString() !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Get submission statistics
      const submissionCount = await Submission.countDocuments({ assignmentId: id });
      const gradedCount = await Submission.countDocuments({ 
        assignmentId: id, 
        status: 'graded' 
      });

      return res.json({
        ...assignment.toObject(),
        submissionCount,
        gradedCount
      });
    }

    res.json(assignment);
  } catch (error) {
    console.error("Error fetching assignment:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;