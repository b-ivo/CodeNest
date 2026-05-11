import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Card from "../components/Card";
import AddCourseCard from "../components/AddCourseCard";
import AddCourse from "../components/AddCourse";
import { 
  FaUserGraduate, 
  FaClipboardList, 
  FaUsers, 
  FaCheckCircle,
  FaPlus,
  FaEye,
  FaClock,
  FaChartLine
} from "react-icons/fa";

export default function TeacherDashboard({ dashboardData }) {
  const { user } = useAuth();
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [courses, setCourses] = useState([]);
  const [refreshCourses, setRefreshCourses] = useState(false);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/teacher/courses", {
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

  const stats = [
    { 
      label: "My Courses", 
      value: dashboardData?.stats?.courseCount || 0, 
      icon: <FaUserGraduate />, 
      color: "bg-blue-500", 
      lightColor: "bg-blue-50",
      textColor: "text-blue-600",
      change: "Active courses"
    },
    { 
      label: "Total Students", 
      value: courses.reduce((sum, course) => sum + (course.enrollmentCount || 0), 0), 
      icon: <FaUsers />, 
      color: "bg-green-500", 
      lightColor: "bg-green-50",
      textColor: "text-green-600",
      change: "Enrolled students"
    },
    { 
      label: "Assignments", 
      value: dashboardData?.stats?.assignmentCount || 0, 
      icon: <FaClipboardList />, 
      color: "bg-purple-500", 
      lightColor: "bg-purple-50",
      textColor: "text-purple-600",
      change: "Created assignments"
    },
    { 
      label: "Pending Grading", 
      value: dashboardData?.stats?.pendingGrading || 0, 
      icon: <FaClock />, 
      color: "bg-orange-500", 
      lightColor: "bg-orange-50",
      textColor: "text-orange-600",
      change: "Need attention"
    },
  ];

  return (
    <div className="space-y-8 fade-in">
      {/* Header Section */}
      <div className="bg-white rounded-2xl p-8 card-shadow border border-gray-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900">
              Welcome back, <span className="text-gradient">Professor {user?.name}</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Manage your courses, track student progress, and create engaging assignments.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowAddCourse(true)}
              className="btn-primary flex items-center gap-2"
            >
              <FaPlus />
              New Course
            </button>
            <button
              onClick={() => navigate("/assignments")}
              className="btn-secondary flex items-center gap-2"
            >
              <FaClipboardList />
              Assignments
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 card-shadow border border-gray-100 group hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${stat.lightColor} flex items-center justify-center ${stat.textColor} group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs text-gray-500 font-medium">{stat.change}</div>
              </div>
            </div>
            <h3 className="text-sm font-semibold text-gray-700">{stat.label}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Content: Courses */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Your Courses</h2>
            <button 
              onClick={() => navigate("/courses")}
              className="text-secondary font-semibold hover:text-blue-700 transition-colors flex items-center gap-2"
            >
              <FaEye />
              View All
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.slice(0, 4).map((course) => (
              <Card key={course._id} course={course} />
            ))}
            <AddCourseCard onAdd={() => setShowAddCourse(true)} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Assignments */}
          <div className="bg-white rounded-2xl p-6 card-shadow border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FaClipboardList className="text-secondary" />
              Recent Assignments
            </h3>
            <div className="space-y-4">
              {dashboardData?.recentAssignments?.slice(0, 3).map((assignment, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                     onClick={() => navigate(`/assignments/${assignment._id}`)}>
                  <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0">
                    <FaClipboardList />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 leading-tight truncate">{assignment.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{assignment.courseId?.courseName}</p>
                  </div>
                </div>
              )) || (
                <p className="text-gray-500 text-sm text-center py-4">No recent assignments</p>
              )}
            </div>
            <button 
              onClick={() => navigate("/assignments")}
              className="w-full mt-4 py-2 text-sm font-semibold text-secondary hover:text-blue-700 transition-colors"
            >
              View All Assignments
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <FaChartLine className="text-accent" />
                <span className="text-sm font-bold uppercase tracking-wider">Quick Actions</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Manage Your Classes</h3>
              <p className="text-white/90 text-sm mb-6 leading-relaxed">
                Create assignments, grade submissions, and track student progress.
              </p>
              <div className="space-y-2">
                <button 
                  onClick={() => navigate("/assignments")}
                  className="w-full py-2 px-4 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 transition-colors text-sm"
                >
                  Create Assignment
                </button>
                <button 
                  onClick={() => navigate("/gradebook")}
                  className="w-full py-2 px-4 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 transition-colors text-sm"
                >
                  View Gradebook
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAddCourse && (
        <AddCourse
          onClose={() => setShowAddCourse(false)}
          onSubmit={handleAddCourseSubmit}
        />
      )}
    </div>
  );
}