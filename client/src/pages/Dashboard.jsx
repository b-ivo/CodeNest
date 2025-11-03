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

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [courses, setCourses] = useState([]);
  const [refreshCourses, setRefreshCourses] = useState(false);
  const navigate = useNavigate();

  // Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/dashboard", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);
  
  // Fetch courses
  const fetchCourses = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/allcourse", {
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
      const res = await fetch("http://localhost:5000/api/addcourse", {
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


  if (loading) return <Loader />;

  return (
    <div className="flex flex-col">
      {/* Upper bar */}
      <div className="flex justify-between mb-6">
        <Input placeholder="Search courses..." />
        <div className="flex gap-7">
          <NotificationBell />
          <UserInfo user={user} onClick={() => navigate("/profile")} />
        </div>
      </div>

      {/* Course cards */}
      <div className="flex flex-wrap gap-6">
        {courses.map((course) => (
          <Card key={course._id} course={course} />
        ))}
        <AddCourseCard onAdd={() => setShowAddCourse(true)} />
        {showAddCourse && (
          <AddCourse
            onClose={() => setShowAddCourse(false)}
            onSubmit={handleAddCourseSubmit}
          />
        )}
      </div>

      {/* Gradebook */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Gradebook</h2>
        <GradeBookPage />
      </div>
    </div>
  );
}
