import SideNavBar from "../components/SideNavBar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar fixed */}
      <SideNavBar />

      {/* Main content */}
      <div className="flex-1 p-8 ml-[220px]">
        <Outlet />
      </div>
    </div>
  );
}
