import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import Button from "../components/Button";
import {
  FaBook,
  FaLayerGroup,
  FaClock,
  FaArrowLeft,
  FaGraduationCap,
  FaUsers,
  FaCheckCircle,
  FaChalkboardTeacher,
  FaClipboardList,
} from "react-icons/fa";

export default function CourseDetails() {
  // Both /teacher/courses/:courseId and /courses/:courseId use "courseId"
  const { courseId } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollMsg, setEnrollMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/course/${courseId}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setCourse(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (courseId) fetchCourse();
  }, [courseId]);

  const handleEnroll = async () => {
    setEnrolling(true);
    setEnrollMsg("");
    try {
      const res = await fetch(`/api/enroll/${courseId}`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setEnrollMsg("✅ Successfully enrolled!");
        setCourse((prev) => ({ ...prev, isEnrolled: true }));
      } else {
        setEnrollMsg(`⚠️ ${data.message}`);
      }
    } catch {
      setEnrollMsg("⚠️ Network error. Please try again.");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <Loader />;
  if (!course)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-2xl">
          <FaBook />
        </div>
        <p className="text-slate-500 font-bold">Course not found.</p>
        <Button onClick={() => navigate(-1)} className="rounded-xl px-8">
          Go Back
        </Button>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto space-y-8 fade-in">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-400 hover:text-secondary font-bold text-sm transition-colors group cursor-pointer"
      >
        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        Back to Courses
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl p-10 border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full -mr-32 -mt-32" />

            <div className="relative z-10">
              <span className="bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full">
                {course.category}
              </span>
              <h1 className="text-4xl font-black text-slate-900 mt-4 mb-6 leading-tight">
                {course.courseName}
              </h1>

              <div className="flex flex-wrap gap-8 py-8 border-y border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-secondary">
                    <FaLayerGroup />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Level
                    </p>
                    <p className="font-bold text-slate-800">{course.classLevel}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-secondary">
                    <FaClock />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Duration
                    </p>
                    <p className="font-bold text-slate-800">{course.periods} Periods</p>
                  </div>
                </div>

                {/* Teacher-only: enrollment count */}
                {user?.role === "teacher" && course.enrollmentCount !== undefined && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-secondary">
                      <FaUsers />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Students
                      </p>
                      <p className="font-bold text-slate-800">{course.enrollmentCount} enrolled</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Teacher info for students */}
              {user?.role === "student" && course.teacherId?.name && (
                <div className="flex items-center gap-3 mt-6 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                    <FaChalkboardTeacher />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Instructor
                    </p>
                    <p className="font-bold text-slate-800">{course.teacherId.name}</p>
                  </div>
                </div>
              )}

              <div className="mt-8">
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  Course Description
                </h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  {course.description ||
                    `This course provides a comprehensive exploration of ${course.courseName.toLowerCase()},
                    focusing on practical skills and foundational knowledge in the field of ${course.category.toLowerCase()}.
                    Students will engage in hands-on projects and theoretical study over ${course.periods} intensive periods.`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          {user?.role === "teacher" ? (
            <div className="bg-slate-900 rounded-3xl p-8 text-white">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <FaGraduationCap className="text-yellow-400" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/assignments")}
                  className="w-full py-4 rounded-2xl bg-white/10 hover:bg-white hover:text-slate-900 font-bold transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <FaClipboardList />
                  Manage Assignments
                </button>
                <button
                  onClick={() => navigate(`/gradebook`)}
                  className="w-full py-4 rounded-2xl bg-secondary text-white font-bold shadow-xl shadow-secondary/30 hover:scale-[1.02] transition-all"
                >
                  View Gradebook
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900">
                <FaGraduationCap className="text-secondary" />
                Enrollment
              </h3>

              {course.isEnrolled ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-green-600 font-bold mb-4">
                    <FaCheckCircle />
                    <span>You are enrolled</span>
                  </div>
                  <button
                    onClick={() => navigate("/assignments")}
                    className="w-full py-4 rounded-2xl bg-secondary text-white font-bold hover:scale-[1.02] transition-all"
                  >
                    View Assignments
                  </button>
                  <button
                    onClick={() => navigate("/gradebook")}
                    className="w-full py-4 rounded-2xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-all"
                  >
                    My Grades
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-slate-500 text-sm mb-4">
                    Enroll in this course to access assignments and track your progress.
                  </p>
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full py-4 rounded-2xl bg-secondary text-white font-bold hover:scale-[1.02] transition-all disabled:opacity-60"
                  >
                    {enrolling ? "Enrolling..." : "Enroll Now"}
                  </button>
                  {enrollMsg && (
                    <p className="text-sm text-center font-medium mt-2">{enrollMsg}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
