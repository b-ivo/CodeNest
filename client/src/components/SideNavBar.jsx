import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBook,
  FaClipboardCheck,
  FaUpload,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";

const SideNavBar = () => {
const navigate = useNavigate();

  const mainLinks = [
    { to: "/", label: "Dashboard", icon: <FaHome /> },
    { to: "/courses", label: "My Courses", icon: <FaBook /> },
    { to: "/assignments", label: "Assignments", icon: <FaClipboardCheck /> },
    { to: "/submit", label: "E-submit", icon: <FaUpload /> },
  ];

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include", // include cookies
      });

      if (res.ok) {
        navigate("/login")
      } else {
        console.error("Failed to log out");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div className="bg-[#161550] h-full w-[220px] rounded-lg flex flex-col justify-between py-8">
      <div className="flex items-center justify-center text-white font-extrabold text-2xl">
        CodeNest
      </div>

      {/* Main links */}
      <div className="flex flex-col text-white font-semibold text-lg gap-3 px-6 mt-6">
        {mainLinks.map(({ to, label, icon }) => (
          <Link
            key={label}
            to={to}
            className="flex items-center gap-3 hover:bg-blue-300 py-2 px-3 rounded-xl transition"
          >
            {icon}
            <span>{label}</span>
          </Link>
        ))}
      </div>

      <div className="border-t border-gray-500 mx-6 my-4"></div>

      {/* Profile link + Logout button */}
      <div className="flex flex-col text-white font-semibold text-lg gap-3 px-6">
        <Link
          to="/profile"
          className="flex items-center gap-3 hover:bg-blue-300 py-2 px-3 rounded-xl transition"
        >
          <FaUser />
          <span>Profile</span>
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 hover:bg-red-500 py-2 px-3 rounded-xl transition"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default SideNavBar;
