import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dueDate: { type: Date, required: true },
    maxPoints: { type: Number, default: 100 },
    attachments: [{ 
      filename: String, 
      url: String 
    }],
    instructions: { type: String },
    status: { 
      type: String, 
      enum: ['draft', 'published', 'closed'], 
      default: 'draft' 
    },
  },
  { timestamps: true }
);

const Assignment = mongoose.model("Assignment", assignmentSchema);
export default Assignment;