import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Card from "../components/Card";
import { 
  FaUserGraduate, 
  FaClipboardList, 
  FaCheckCircle, 
  FaChartLine,
  FaBook,
  FaClock,
  FaAward,
  FaExclamationTriangle,
  FaSearch
} from "react-icons/fa";

export default function StudentDashboard({ dashboardData }) {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/student/courses", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) setCourses(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAvailableCourses = async () => {
    try {
      const res = await fetch("/api/available-courses", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) setAvailableCourses(data.slice(0, 3)); // Show only 3 for dashboard
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchAvailableCourses();
  }, []);

  const handleEnrollCourse = async (courseId) => {
    try {
      const res = await fetch(`/api/enroll/${courseId}`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        fetchCourses();
        fetchAvailableCourses();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const stats = [
    { 
      label: "Enrolled Courses", 
      value: dashboardData?.stats?.enrollmentCount || 0, 
      icon: <FaUserGraduate />, 
      color: "bg-blue-500", 
      lightColor: "bg-blue-50",
      textColor: "text-blue-600",
      change: "Active enrollments"
    },
    { 
      label: "Pending Tasks", 
      value: dashboardData?.stats?.pendingAssignments || 0, 
      icon: <FaClipboardList />, 
      color: "bg-orange-500", 
      lightColor: "bg-orange-50",
      textColor: "text-orange-600",
      change: "Due soon"
    },
    { 
      label: "Completed", 
      value: dashboardData?.stats?.submissionCount || 0, 
      icon: <FaCheckCircle />, 
      color: "bg-green-500", 
      lightColor: "bg-green-50",
      textColor: "text-green-600",
      change: "Submissions made"
    },
    { 
      label: "Graded Work", 
      value: dashboardData?.stats?.gradedCount || 0, 
      icon: <FaChartLine />, 
      color: "bg-purple-500", 
      lightColor: "bg-purple-50",
      textColor: "text-purple-600",
      change: "Received grades"
    },
  ];

  return (
    <div className="space-y-8 fade-in">
      {/* Header Section */}
      <div className="bg-white rounded-2xl p-8 card-shadow border border-gray-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900">
              Welcome back, <span className="text-gradient">{user?.name}</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Continue your learning journey. You have {dashboardData?.stats?.pendingAssignments || 0} pending assignments.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="relative hidden lg:block">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search courses, assignments..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-4 py-3 w-80 rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
              />
            </div>
            
            <button
              onClick={() => navigate("/courses")}
              className="btn-primary flex items-center gap-2"
            >
              <FaBook />
              Browse Courses
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
          {/* Enrolled Courses */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
              <button 
                onClick={() => navigate("/courses")}
                className="text-secondary font-semibold hover:text-blue-700 transition-colors"
              >
                View All
              </button>
            </div>
            
            {courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.slice(0, 4).map((course) => (
                  <Card key={course._id} course={course} />
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-2xl p-8 text-center">
                <FaUserGraduate className="text-4xl text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Courses Yet</h3>
                <p className="text-gray-500 mb-4">Start your learning journey by enrolling in a course</p>
                <button 
                  onClick={() => navigate("/courses")}
                  className="btn-primary"
                >
                  Browse Courses
                </button>
              </div>
            )}
          </div>

          {/* Available Courses */}
          {availableCourses.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended Courses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableCourses.map((course) => (
                  <div key={course._id} className="bg-white rounded-2xl p-6 card-shadow border border-gray-100 hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                        <FaBook />
                      </div>
                      <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-bold uppercase tracking-wider">
                        Available
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{course.courseName}</h3>
                    <p className="text-sm text-gray-500 mb-4">{course.category}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span>Level {course.classLevel}</span>
                      <span>{course.periods} Periods</span>
                    </div>
                    <button
                      onClick={() => handleEnrollCourse(course._id)}
                      className="w-full btn-secondary text-sm"
                    >
                      Enroll Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pending Assignments */}
          <div className="bg-white rounded-2xl p-6 card-shadow border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FaClock className="text-orange-500" />
              Upcoming Deadlines
            </h3>
            <div className="space-y-4">
              {dashboardData?.pendingAssignments?.slice(0, 3).map((assignment, i) => {
                const dueDate = new Date(assignment.dueDate);
                const isUrgent = (dueDate - new Date()) < 24 * 60 * 60 * 1000; // Less than 24 hours
                
                return (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                       onClick={() => navigate(`/assignments/${assignment._id}`)}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isUrgent ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                    }`}>
                      {isUrgent ? <FaExclamationTriangle /> : <FaClock />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 leading-tight truncate">{assignment.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{assignment.courseId?.courseName}</p>
                      <p className={`text-xs mt-1 font-medium ${
                        isUrgent ? 'text-red-600' : 'text-orange-600'
                      }`}>
                        Due {dueDate.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              }) || (
                <p className="text-gray-500 text-sm text-center py-4">No pending assignments</p>
              )}
            </div>
            <button 
              onClick={() => navigate("/assignments")}
              className="w-full mt-4 py-2 text-sm font-semibold text-secondary hover:text-blue-700 transition-colors"
            >
              View All Assignments
            </button>
          </div>

          {/* Recent Grades */}
          <div className="bg-white rounded-2xl p-6 card-shadow border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FaAward className="text-green-500" />
              Recent Grades
            </h3>
            <div className="space-y-4">
              {dashboardData?.recentGrades?.slice(0, 3).map((grade, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {grade.assignmentId?.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {grade.assignmentId?.courseId?.courseName}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    grade.grade >= 90 ? 'bg-green-50 text-green-600' :
                    grade.grade >= 80 ? 'bg-blue-50 text-blue-600' :
                    grade.grade >= 70 ? 'bg-yellow-50 text-yellow-600' :
                    'bg-red-50 text-red-600'
                  }`}>
                    {grade.grade}%
                  </div>
                </div>
              )) || (
                <p className="text-gray-500 text-sm text-center py-4">No grades yet</p>
              )}
            </div>
            <button 
              onClick={() => navigate("/gradebook")}
              className="w-full mt-4 py-2 text-sm font-semibold text-secondary hover:text-blue-700 transition-colors"
            >
              View Gradebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}