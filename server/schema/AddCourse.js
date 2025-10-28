import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    courseName: { type: String, required: true },
    category: { type: String, required: true },
    classLevel: { type: String, required: true },
    periods: { type: Number, required: true },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const Course = mongoose.model("Course", courseSchema);
export default Course;
