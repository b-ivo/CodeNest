import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Card from "../components/Card";
import AddCourse from "../components/AddCourse";
import AddCourseCard from "../components/AddCourseCard";
import Loader from "../components/Loader";
import { FaPlus, FaSearch, FaFilter, FaUserGraduate, FaChalkboardTeacher } from "react-icons/fa";

const MyCourses = () => {
  const { user, loading } = useAuth();
  const [courses, setCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [refreshCourses, setRefreshCourses] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState(user?.role === 'teacher' ? 'my-courses' : 'enrolled');
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      const endpoint = user?.role === 'teacher' ? '/api/teacher/courses' : '/api/student/courses';
      const res = await fetch(endpoint, {
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
    if (user?.role === 'student') {
      try {
        const res = await fetch("/api/available-courses", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) setAvailableCourses(data);
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchAvailableCourses();
  }, [refreshCourses, user]);

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

  const handleEnrollCourse = async (courseId) => {
    try {
      const res = await fetch(`/api/enroll/${courseId}`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        setRefreshCourses((prev) => !prev);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredCourses = courses.filter(course => 
    course.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAvailableCourses = availableCourses.filter(course => 
    course.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
    <div className="space-y-8 fade-in">
      {/* Header */}
      <div className="bg-white rounded-2xl p-8 card-shadow border border-gray-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              {user?.role === 'teacher' ? <FaChalkboardTeacher className="text-secondary" /> : <FaUserGraduate className="text-secondary" />}
              {user?.role === 'teacher' ? 'My Courses' : 'Course Catalog'}
            </h1>
            <p className="text-gray-600 text-lg">
              {user?.role === 'teacher' 
                ? 'Create and manage your courses, track student progress'
                : 'Discover new courses and manage your learning journey'
              }
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search courses..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-4 py-3 w-80 rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
              />
            </div>
            
            {user?.role === 'teacher' && (
              <button
                onClick={() => setShowAddCourse(true)}
                className="btn-primary flex items-center gap-2"
              >
                <FaPlus />
                Create Course
              </button>
            )}
          </div>
        </div>

        {/* Tabs for Students */}
        {user?.role === 'student' && (
          <div className="flex gap-4 mt-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('enrolled')}
              className={`pb-3 px-1 font-semibold text-sm transition-colors ${
                activeTab === 'enrolled'
                  ? 'text-secondary border-b-2 border-secondary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              My Enrolled Courses ({courses.length})
            </button>
            <button
              onClick={() => setActiveTab('available')}
              className={`pb-3 px-1 font-semibold text-sm transition-colors ${
                activeTab === 'available'
                  ? 'text-secondary border-b-2 border-secondary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Available Courses ({availableCourses.length})
            </button>
          </div>
        )}
      </div>

      {/* Course Grid */}
      <div>
        {user?.role === 'teacher' || activeTab === 'enrolled' ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {user?.role === 'teacher' ? 'Your Created Courses' : 'Enrolled Courses'}
              </h2>
              <span className="text-gray-500 text-sm">
                {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCourses.map((course) => (
                  <Card key={course._id} course={course} />
                ))}
                {user?.role === 'teacher' && (
                  <AddCourseCard onAdd={() => setShowAddCourse(true)} />
                )}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-2xl p-12 text-center">
                {user?.role === 'teacher' ? <FaChalkboardTeacher /> : <FaUserGraduate />}
                <h3 className="text-xl font-semibold text-gray-700 mb-2 mt-4">
                  {user?.role === 'teacher' ? 'No Courses Created Yet' : 'No Courses Enrolled'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {user?.role === 'teacher' 
                    ? 'Start by creating your first course to share knowledge with students'
                    : 'Browse available courses and start your learning journey'
                  }
                </p>
                {user?.role === 'teacher' ? (
                  <button 
                    onClick={() => setShowAddCourse(true)}
                    className="btn-primary"
                  >
                    Create Your First Course
                  </button>
                ) : (
                  <button 
                    onClick={() => setActiveTab('available')}
                    className="btn-primary"
                  >
                    Browse Available Courses
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Available Courses</h2>
              <span className="text-gray-500 text-sm">
                {filteredAvailableCourses.length} course{filteredAvailableCourses.length !== 1 ? 's' : ''} available
              </span>
            </div>
            
            {filteredAvailableCourses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAvailableCourses.map((course) => (
                  <div key={course._id} className="bg-white rounded-2xl p-6 card-shadow border border-gray-100 hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                        <FaUserGraduate />
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
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-6">
                      <span>By: {course.teacherId?.name}</span>
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
            ) : (
              <div className="bg-gray-50 rounded-2xl p-12 text-center">
                <FaUserGraduate className="text-4xl text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Available Courses</h3>
                <p className="text-gray-500">Check back later for new courses or contact your administrator</p>
              </div>
            )}
          </div>
        )}
      </div>

      {showAddCourse && (
        <AddCourse
          onClose={() => setShowAddCourse(false)}
          onSubmit={handleAddCourseSubmit}
        />
      )}
    </div>
  );
};

export default MyCourses;
