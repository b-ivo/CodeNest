import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SideNavBar from "../components/SideNavBar";
import Input from "../components/Input";
import Button from "../components/Button";

// Mock courses
const mockCourses = [
  { id: "C101", name: "Web Development" },
  { id: "C102", name: "Data Structures" },
];

// Mock grades
const mockGrades = [
  {
    id: 1,
    courseId: "C101",
    studentId: "S101",
    studentName: "Alice",
    assignment: "Assignment 1",
    maxScore: 100,
    score: 90,
    status: "Graded",
  },
  {
    id: 2,
    courseId: "C101",
    studentId: "S102",
    studentName: "Bob",
    assignment: "Assignment 1",
    maxScore: 100,
    score: 75,
    status: "Graded",
  },
  {
    id: 3,
    courseId: "C102",
    studentId: "S103",
    studentName: "Charlie",
    assignment: "Assignment 1",
    maxScore: 100,
    score: 0,
    status: "Pending",
  },
  {
    id: 4,
    courseId: "C102",
    studentId: "S104",
    studentName: "Diana",
    assignment: "Assignment 2",
    maxScore: 100,
    score: 85,
    status: "Graded",
  },
];

export default function GradeBookPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCourseId = queryParams.get("course");

  const [courseId, setCourseId] = useState(initialCourseId || "");
  const [grades, setGrades] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // filter mock grades based on selected course
    const filtered = courseId
      ? mockGrades.filter((g) => g.courseId === courseId)
      : mockGrades;
    setGrades(filtered);
  }, [courseId]);

  return (
    <div className="min-h-screen flex bg-gray-100">
      <SideNavBar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Grade Book</h1>
          <Input placeholder="Search students or assignments..." />
        </div>

        {/* Course selector */}
        <select
          className="mb-4 p-2 rounded border"
          onChange={(e) => setCourseId(e.target.value)}
          value={courseId}
        >
          <option value="">All Courses</option>
          {mockCourses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>

        {/* Grades table */}
        <div className="bg-white rounded-xl shadow overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                {[
                  "Student ID",
                  "Name",
                  "Assignment",
                  "Max Score",
                  "Score",
                  "Status",
                ].map((h) => (
                  <th key={h} className="py-2 px-4 border-b">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {grades.length ? (
                grades.map((g) => (
                  <tr key={g.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4">{g.studentId}</td>
                    <td className="py-2 px-4">{g.studentName}</td>
                    <td className="py-2 px-4">{g.assignment}</td>
                    <td className="py-2 px-4">{g.maxScore}</td>
                    <td className="py-2 px-4">{g.score}</td>
                    <td
                      className={`py-2 px-4 font-medium ${g.status === "Graded" ? "text-green-600" : "text-orange-500"}`}
                    >
                      {g.status}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    No grades to display
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-end gap-4">
          <Button>Export CSV</Button>
          <Button>Submit Grades</Button>
        </div>
      </div>
    </div>
  );
}
