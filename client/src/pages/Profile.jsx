import { useEffect, useState } from "react";
import Input from "../components/Input";
import NotificationBell from "../components/Notification";
import { useNavigate } from "react-router-dom";
import UserInfo from "../components/UserInfo";
import Loader from "../components/Loader";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const baseUrl = import.meta.env.VITE_APIS;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/dashboard`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Unauthorized");

        const data = await res.json();
        setUser(data.user);
      } catch {
        alert("You are not authorized to view this page.");
        setUser(null);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [baseUrl, navigate]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 px-10 py-8 flex flex-col gap-10 overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="w-1/3">
          <Input placeholder="Search courses, assignments..." />
        </div>
        <div className="flex items-center gap-6">
          <NotificationBell />
          <UserInfo user={user} />
        </div>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-800">Profile</h1>
        <p className="text-gray-500 mt-2">Find your relevant information</p>
      </div>

      {/* Profile content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Card */}
        <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center text-center border border-gray-200">
          <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 text-4xl font-semibold mb-4">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <p className="text-xl font-semibold text-gray-800">{user?.name}</p>
          <span className="text-sm text-gray-500">{user?.email}</span>
        </div>

        {/* Right Details Card */}
        <div className="bg-white shadow-md rounded-2xl p-6 md:col-span-2 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3 mb-6">
            Personal Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-gray-500 text-sm uppercase tracking-wide">
                  Full Name
                </p>
                <span className="text-lg font-medium text-gray-800">
                  {user?.name}
                </span>
              </div>
              <div>
                <p className="text-gray-500 text-sm uppercase tracking-wide">
                  Role
                </p>
                <span className="text-lg font-medium text-gray-800">
                  {user?.role}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-gray-500 text-sm uppercase tracking-wide">
                  Email
                </p>
                <span className="text-lg font-medium text-gray-800">
                  {user?.email}
                </span>
              </div>
              <div>
                <p className="text-gray-500 text-sm uppercase tracking-wide">
                  Joined
                </p>
                <span className="text-lg font-medium text-gray-800">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
