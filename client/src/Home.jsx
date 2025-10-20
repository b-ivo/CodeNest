import SideNavBar from "./components/SideNavBar";

export default function Home() {
  return (
    <div className="bg-gray-200 w-full h-dvh p-4">      
      <SideNavBar />
      <div>
        <h1>Dashboard</h1>
      </div>
    </div>
  );
}
