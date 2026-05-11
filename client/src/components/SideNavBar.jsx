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
} from "react-icons/fa";

const SideNavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const mainLinks = [
    { to: "/", label: "Dashboard", icon: <FaHome /> },
    { to: "/courses", label: "My Courses", icon: <FaBook /> },
    { to: "/assignments", label: "Assignments", icon: <FaClipboardCheck /> },
    { to: "/submit", label: "E-submit", icon: <FaUpload /> },
    { to: "/gradebook", label: "My grades", icon: <FaBookReader /> },
  ];

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

  return (
    <div className="fixed top-0 left-0 h-screen w-[260px] bg-primary flex flex-col justify-between py-8 text-white overflow-hidden shadow-2xl border-r border-white/10">
      <div className="px-8 mb-10">
        <div className="flex items-center gap-3 font-extrabold text-3xl tracking-tight">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-primary shadow-lg shadow-accent/20">
            C
          </div>
          CodeNest
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {mainLinks.map(({ to, label, icon }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={label}
              to={to}
              className={`flex items-center gap-4 w-full py-3 px-4 rounded-xl transition-all duration-300 group ${
                isActive 
                  ? "bg-white/10 text-white shadow-inner" 
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className={`text-xl transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-accent" : ""}`}>
                {icon}
              </span>
              <span className="font-medium tracking-wide">{label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 mt-auto pt-6 space-y-2 border-t border-white/5">
        <Link
          to="/profile"
          className={`flex items-center gap-4 w-full py-3 px-4 rounded-xl transition-all duration-300 group ${
            location.pathname === "/profile"
              ? "bg-white/10 text-white"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          <span className="text-xl group-hover:scale-110 transition-transform"><FaUser /></span>
          <span className="font-medium tracking-wide">Profile</span>
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-4 w-full py-3 px-4 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300 group cursor-pointer"
        >
          <span className="text-xl group-hover:scale-110 transition-transform"><FaSignOutAlt /></span>
          <span className="font-medium tracking-wide">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default SideNavBar;
