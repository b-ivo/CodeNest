import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import SideNavBar from "../components/SideNavBar";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/dashboard", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Unauthorized");

        const data = await res.json();
        setUser(data.user);
        setMessage(data.message);
      } catch {
        setMessage("You are not authorized to view this page.");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="flex items-center justify-center"> <Loader /> </div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-row ">
      {/* Nav bar */}
      <div className="">
        <SideNavBar /> 
      </div>
      {/* Dasboard */}
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-6 h-[400px]">
        <h1 className="text-2xl font-bold mb-4">{message}</h1>

        {user && (
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-2">User Info</h2>
            <p className="text-gray-700">
              <span className="font-medium">Name:</span> {user.name}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Email:</span> {user.email}
            </p>
          </div>
        )}

        <div className="mt-6 p-6 bg-blue-50 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Dashboard</h2>
          <p className="text-gray-700">
            Welcome to your dashboard. You can put charts, stats, or recent
            activity here.
          </p>
        </div>
      </div>
    </div>
  );
}
