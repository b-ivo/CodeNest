import { Link } from "react-router-dom";
import {
  FaHome,
  FaBook,
  FaClipboardCheck,
  FaUpload,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";

const SideNavBar = () => {
  const mainLinks = [
    { to: "/Dashboard", label: "Dashboard", icon: <FaHome /> },
    { to: "/courses", label: "My Courses", icon: <FaBook /> },
    { to: "/assignments", label: "Assignments", icon: <FaClipboardCheck /> },
    { to: "/submit", label: "E-submit", icon: <FaUpload /> },
  ];

  const bottomLinks = [
    { to: "/profile", label: "Profile", icon: <FaUser /> },
    { to: "/logout", label: "Logout", icon: <FaSignOutAlt /> },
  ];

  return (
    <div className="bg-[#161550] h-full w-[220px] rounded-lg flex flex-col justify-between py-8">
      <div className="flex items-center justify-center text-white font-extrabold text-2xl">
        CodeNest
      </div>

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

      <div className="flex flex-col text-white font-semibold text-lg gap-3 px-6">
        {bottomLinks.map(({ to, label, icon }) => (
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
    </div>
  );
};

export default SideNavBar;
