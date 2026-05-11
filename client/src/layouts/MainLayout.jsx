import SideNavBar from "../components/SideNavBar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <SideNavBar />

      {/* Main content */}
      <main className="flex-1 ml-72 transition-all duration-300">
        <div className="min-h-screen p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
