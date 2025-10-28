import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import SideNavBar from "../components/SideNavBar";
import Input from "../components/Input";
import UserInfo from "../components/UserInfo";
import NotificationBell from "../components/Notification";
import Card from "../components/card";
import AddCourseCard from "../components/AddCourseCard";
import AddCourse from "../components/AddCourse";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  // fetches the courses in the backend
  const fetchCourses = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/allcourse", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setCourses(data);
      } else {
        console.error("Error fetching courses:", data.message);
      }
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [courses]);

  // handle add course click
  const handleAddCourseClick = () => setShowAddCourse(true);
  // handle add course submit
  const handleAddCourseSubmit = (courseData) => {
    console.log("New course data:", courseData);
  };

  // fetches the user data and then check if you are alloed to use this page

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/dashboard", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Unauthorized");

        const data = await res.json();
        setUser(data.user);
        setMessage(data.message);
      } catch {
        setMessage("You are not authorized to view this page.");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center">
        {" "}
        <Loader />{" "}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-row ">
      {/* Nav bar */}
      <div>
        <SideNavBar />
      </div>
      <div className="flex flex-col h-12 justify-between w-full">
        {/* The upper bar that contains search bar notification menu and the user information */}
        <div className="flex justify-between">
          <div className="w-1/3 ml-5">
            <Input placeholder="search courses , assignments ..." />
          </div>
          <div className="flex gap-7 z-50">
            <NotificationBell />
            <UserInfo user={user} onClick={() => navigate("/profile")} />
          </div>
        </div>
        {/* The Dashboard cards */}
        <div>
          <h1 className="ml-6 mt-4 text-2xl font-bold">Dashboard</h1>
        </div>
        {/* Cards */}
        <div className="ml-6 mt-6 flex flex-wrap gap-6">
          {courses.map((course) => (
            <Card key={course.id} course={course} />
          ))}
          <AddCourseCard onAdd={handleAddCourseClick} />
          {showAddCourse && (
            <AddCourse
              onClose={() => setShowAddCourse(false)}
              onSubmit={handleAddCourseSubmit}
            />
          )}
        </div>
        <div className="text-2xl font-bold ml-6 mt-6">
          <h1>Grade book</h1>
        </div>
      </div>
    </div>
  );
}
