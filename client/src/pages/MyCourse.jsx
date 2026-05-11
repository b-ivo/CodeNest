import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Input from "../components/Input";
import UserInfo from "../components/UserInfo";
import NotificationBell from "../components/Notification";
import Card from "../components/Card";
import AddCourse from "../components/AddCourse";
import AddCourseCard from "../components/AddCourseCard";
import Loader from "../components/Loader";

const MyCourses = () => {
  const { user, loading } = useAuth();
  const [courses, setCourses] = useState([]);
  const [showAddcourse, setShowAddCourse] = useState(false);
  const [refreshCourses, setRefreshCourses] = useState(false);
  const navigate = useNavigate();

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

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Loader />
      </div>
    );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Upper bar */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            My <span className="text-gradient">Courses</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">Manage and organize your enrolled learning paths.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
          <NotificationBell />
          <UserInfo user={user} onClick={() => navigate("/profile")} />
        </div>
      </header>

      {/* Grid Content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
        {courses.map((course) => (
          <Card key={course._id} course={course} />
        ))}
        <AddCourseCard onAdd={() => setShowAddCourse(true)} />
      </div>

      {showAddcourse && (
        <AddCourse
          onClose={() => setShowAddCourse(false)}
          onSubmit={handleAddCourseSubmit}
        />
      )}
    </div>
  );
};

export default MyCourses;
