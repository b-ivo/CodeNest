import { Link, useNavigate } from "react-router-dom";
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

  const mainLinks = [
    { to: "/", label: "Dashboard", icon: <FaHome /> },
    { to: "/courses", label: "My Courses", icon: <FaBook /> },
    { to: "/assignments", label: "Assignments", icon: <FaClipboardCheck /> },
    { to: "/submit", label: "E-submit", icon: <FaUpload /> },
    { to: "/gradebook", label: "My grades", icon: <FaBookReader /> },
  ];

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) navigate("/login");
      else console.error("Logout failed");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div
      className="fixed top-0 left-0 h-screen w-[220px] bg-gradient-to-b from-[#161550] to-blue-600
                    flex flex-col justify-between py-8 text-white overflow-hidden shadow-lg " 
    >
      <div className="flex items-center justify-center font-extrabold text-2xl">
        CodeNest
      </div>

      <div className="flex-1 flex flex-col gap-3 px-6 mt-6 overflow-y-auto font-semibold text-lg">
        {mainLinks.map(({ to, label, icon }) => (
          <Link
            key={label}
            to={to}
            className="flex items-center gap-3 w-full py-2 px-3 relative
                       after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px]
                       after:bg-white after:transition-all after:duration-500 hover:after:w-full"
          >
            {icon}
            <span>{label}</span>
          </Link>
        ))}
      </div>

      <div className="border-t border-gray-500 mx-6 my-4"></div>

      <div className="flex flex-col gap-3 px-6 mb-2 font-semibold text-lg">
        <Link
          to="/profile"
          className="flex items-center gap-3 w-full py-2 px-3 relative
                     after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px]
                     after:bg-white after:transition-all after:duration-500 hover:after:w-full"
        >
          <FaUser />
          <span>Profile</span>
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full py-2 px-3 relative
                     after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px]
                     after:bg-red-500 after:transition-all after:duration-500 hover:after:w-full cursor-pointer"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default SideNavBar;
