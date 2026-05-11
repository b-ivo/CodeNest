import SideNavBar from "../components/SideNavBar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar fixed */}
      <SideNavBar />

      {/* Main content */}
      <main className="flex-1 p-8 ml-[260px] transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
