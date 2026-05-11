import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaHome,
  FaBook,
  FaClipboardCheck,
  FaUpload,
  FaUser,
  FaSignOutAlt,
  FaBookReader,
  FaChevronRight,
  FaUsers,
  FaChalkboardTeacher,
  FaUserGraduate,
} from "react-icons/fa";

const SideNavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  // Role-based navigation links
  const getNavigationLinks = () => {
    if (user?.role === 'teacher') {
      return [
        { to: "/", label: "Dashboard", icon: <FaHome />, description: "Overview & Analytics" },
        { to: "/courses", label: "My Courses", icon: <FaBook />, description: "Course Management" },
        { to: "/assignments", label: "Assignments", icon: <FaClipboardCheck />, description: "Create & Grade" },
        { to: "/gradebook", label: "Gradebook", icon: <FaBookReader />, description: "Student Progress" },
      ];
    } else {
      return [
        { to: "/", label: "Dashboard", icon: <FaHome />, description: "Overview & Progress" },
        { to: "/courses", label: "My Courses", icon: <FaBook />, description: "Enrolled Courses" },
        { to: "/assignments", label: "Assignments", icon: <FaClipboardCheck />, description: "Tasks & Submissions" },
        { to: "/submit", label: "Submit Work", icon: <FaUpload />, description: "Upload Assignments" },
        { to: "/gradebook", label: "My Grades", icon: <FaBookReader />, description: "Academic Progress" },
      ];
    }
  };

  const mainLinks = getNavigationLinks();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        logout();
        navigate("/login");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const getRoleIcon = () => {
    return user?.role === 'teacher' ? <FaChalkboardTeacher /> : <FaUserGraduate />;
  };

  const getRoleColor = () => {
    return user?.role === 'teacher' ? 'from-blue-600 to-purple-600' : 'from-green-600 to-blue-600';
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-72 bg-white flex flex-col shadow-2xl border-r border-gray-100 z-50">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${getRoleColor()} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
            C
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">CodeNest</h1>
            <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
              {getRoleIcon()}
              {user?.role === 'teacher' ? 'Teacher Portal' : 'Student Portal'}
            </p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
             onClick={() => navigate("/profile")}>
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getRoleColor()} flex items-center justify-center text-white font-semibold`}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wider flex items-center gap-1">
              {getRoleIcon()}
              {user?.role}
            </p>
          </div>
          <FaChevronRight className="text-gray-400 text-xs" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <div className="mb-6">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-3">
            {user?.role === 'teacher' ? 'Teaching Tools' : 'Learning Hub'}
          </h3>
          {mainLinks.map(({ to, label, icon, description }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={label}
                to={to}
                className={`flex items-center gap-4 w-full py-3 px-4 rounded-xl transition-all duration-300 group relative ${
                  isActive 
                    ? `bg-gradient-to-r ${getRoleColor()} text-white shadow-lg` 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <span className={`text-lg transition-all duration-300 ${
                  isActive ? "text-white" : "text-gray-400 group-hover:text-secondary"
                }`}>
                  {icon}
                </span>
                <div className="flex-1">
                  <span className="font-semibold text-sm">{label}</span>
                  <p className={`text-xs mt-0.5 ${
                    isActive ? "text-white/80" : "text-gray-400"
                  }`}>
                    {description}
                  </p>
                </div>
                {isActive && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Role-specific quick actions */}
        {user?.role === 'teacher' && (
          <div className="mb-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-3">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => navigate("/courses?action=create")}
                className="flex items-center gap-3 w-full py-2 px-4 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all text-sm"
              >
                <FaBook className="text-blue-500" />
                Create Course
              </button>
              <button
                onClick={() => navigate("/assignments?action=create")}
                className="flex items-center gap-3 w-full py-2 px-4 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all text-sm"
              >
                <FaClipboardCheck className="text-green-500" />
                New Assignment
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 w-full py-3 px-4 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-300 group"
        >
          <FaSignOutAlt className="text-lg group-hover:scale-110 transition-transform" />
          <div className="flex-1 text-left">
            <span className="font-semibold text-sm">Sign Out</span>
            <p className="text-xs text-red-400 mt-0.5">End your session</p>
          </div>
        </button>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">
            © 2024 CodeNest Platform
          </p>
        </div>
      </div>
    </div>
  );
};

export default SideNavBar;
