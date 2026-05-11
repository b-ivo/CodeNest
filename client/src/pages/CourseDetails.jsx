import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import Button from "../components/Button";
import { FaBook, FaLayerGroup, FaClock, FaArrowLeft, FaGraduationCap } from "react-icons/fa";

export default function CourseDetails() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(
          `/api/course/${courseId}`,
          {
            credentials: "include",
          },
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setCourse(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  if (loading) return <Loader />;
  if (!course)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-2xl">
          <FaBook />
        </div>
        <p className="text-slate-500 font-bold">Course not found.</p>
        <Button onClick={() => navigate(-1)} className="rounded-xl px-8">Go Back</Button>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-400 hover:text-primary font-bold text-sm transition-colors group cursor-pointer"
      >
        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        Back to Courses
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl p-10 border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32" />
            
            <div className="relative z-10">
              <span className="bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full">
                {course.category}
              </span>
              <h1 className="text-4xl font-black text-slate-900 mt-4 mb-6 leading-tight">
                {course.courseName}
              </h1>
              
              <div className="flex flex-wrap gap-8 py-8 border-y border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-primary">
                    <FaLayerGroup />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Level</p>
                    <p className="font-bold text-slate-800">{course.classLevel}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-primary">
                    <FaClock />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Duration</p>
                    <p className="font-bold text-slate-800">{course.periods} Periods</p>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Course Description</h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  This course provides a comprehensive exploration of {course.courseName.toLowerCase()}, 
                  focusing on practical skills and foundational knowledge in the field of {course.category.toLowerCase()}. 
                  Students will engage in hands-on projects and theoretical study over {course.periods} intensive periods.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl p-8 text-white">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <FaGraduationCap className="text-accent" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full py-4 rounded-2xl bg-white/10 hover:bg-white hover:text-slate-900 font-bold transition-all duration-300">
                Download Syllabus
              </button>
              <button className="w-full py-4 rounded-2xl bg-primary text-white font-bold shadow-xl shadow-primary/30 hover:scale-[1.02] transition-all">
                Enter Classroom
              </button>
              <button 
                onClick={() => navigate(`/gradebook?course=${course._id}`)}
                className="w-full py-4 rounded-2xl bg-transparent border border-white/20 text-white/70 hover:border-white hover:text-white font-bold transition-all"
              >
                View Gradebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
