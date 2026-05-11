import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    courseName: { type: String, required: true },
    category: { type: String, required: true },
    classLevel: { type: String, required: true },
    periods: { type: Number, required: true },
    description: { type: String, default: '' },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: { type: Boolean, default: true },
    maxEnrollments: { type: Number, default: 50 },
  },
  { timestamps: true },
);

const Course = mongoose.models.Course || mongoose.model("Course", courseSchema);
export default Course;
