import Input from "../components/Input";
import UserInfo from "../components/UserInfo";
import NotificationBell from "../components/Notification";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import Card from "../components/Card";
import AddCourse from "../components/AddCourse";
import AddCourseCard from "../components/AddCourseCard";

const MyCourses = () => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState();
  const [courses, setCourses] = useState([]);
  const [showAddcourse, setShowAddCourse] = useState(false);

  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_APIS;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/dashboard`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Unauthorized");

        const data = await res.json();
        setUser(data.user);
      } catch {
        alert("You are not authorized to view this page.");
        setUser(null);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  });

  const fetchCourse = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/allcourse`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      console.log(data);

      if (res.ok) setCourses(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCourse();
  });

  const handleAddCourseSubmit = async (courseData) => {
    try {
      const res = await fetch(`${baseUrl}/api/addcourse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseData),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setShowAddCourse(false);
    } catch (err) {
      console.log(err.message);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center">
        {" "}
        <Loader />{" "}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col">
      {/* Upper bar */}
      <div className="flex flex-col w-full justify-between h-12">
        <div></div>
        <div className="flex justify-between">
          <div className="ml-5 w-1/3">
            <Input placeholder="search courses , assignments ..." />
          </div>
          <div className="flex gap-7 ">
            <NotificationBell />
            <UserInfo user={user} onClick={() => navigate("/profile")} />
          </div>
        </div>
      </div>
      <div className="mt-10 ml-5 flex gap-10">
        {courses.map((course) => (
          <Card key={course._id} course={course} />
        ))}
        <AddCourseCard onAdd={() => setShowAddCourse(true)} />
        {showAddcourse && (
          <AddCourse
            onClose={() => setShowAddCourse(false)}
            onSubmit={handleAddCourseSubmit}
          />
        )}
      </div>
      <div></div>
    </div>
  );
};

export default MyCourses;
