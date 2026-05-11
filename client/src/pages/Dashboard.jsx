import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import Input from "../components/Input";
import UserInfo from "../components/UserInfo";
import NotificationBell from "../components/Notification";
import Card from "../components/Card";
import AddCourseCard from "../components/AddCourseCard";
import AddCourse from "../components/AddCourse";
import GradeBookPage from "../components/GradeBookCard";

import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [courses, setCourses] = useState([]);
  const [refreshCourses, setRefreshCourses] = useState(false);
  const navigate = useNavigate();
  
  // Fetch courses
  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/allcourse", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) setCourses(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [refreshCourses]);

  // Add course
  const handleAddCourseSubmit = async (courseData) => {
    try {
      const res = await fetch("/api/addcourse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseData),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setShowAddCourse(false);
      setRefreshCourses((prev) => !prev);
    } catch (err) {
      console.error(err);
    }
  };


  if (authLoading) return <Loader />;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Upper bar */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Welcome back, <span className="text-gradient">{user?.name?.split(' ')[0]}</span>! 👋
          </h1>
          <p className="text-slate-500 font-medium mt-1">Here is what's happening with your courses today.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
          <div className="hidden sm:block">
            <Input placeholder="Search courses, students..." className="border-none bg-transparent focus:ring-0 w-64" />
          </div>
          <div className="h-8 w-px bg-slate-100 mx-2" />
          <NotificationBell />
          <UserInfo user={user} onClick={() => navigate("/profile")} />
        </div>
      </header>

      {/* Course Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            Active Courses
            <span className="bg-slate-100 text-slate-400 text-xs px-2 py-0.5 rounded-full">{courses.length}</span>
          </h2>
          <button className="text-sm font-bold text-primary hover:underline">View All</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
          {courses.map((course) => (
            <Card key={course._id} course={course} />
          ))}
          <AddCourseCard onAdd={() => setShowAddCourse(true)} />
        </div>

        {showAddCourse && (
          <AddCourse
            onClose={() => setShowAddCourse(false)}
            onSubmit={handleAddCourseSubmit}
          />
        )}
      </section>

      {/* Gradebook Section */}
      <section className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Performance Overview</h2>
            <p className="text-slate-500 text-sm font-medium">Recent grades and academic progress.</p>
          </div>
          <button className="px-5 py-2 rounded-xl bg-slate-50 text-slate-600 font-bold text-sm hover:bg-slate-100 transition-colors">Download Report</button>
        </div>
        <GradeBookPage />
      </section>
    </div>
  );
}
