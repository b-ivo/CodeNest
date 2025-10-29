import { useEffect, useState } from "react";
import SideNavBar from "../components/SideNavBar";
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
  });

  if (loading)
    return (
      <div className="flex items-center justify-center">
        {" "}
        <Loader />{" "}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-row">
      <div>
        <SideNavBar />
      </div>

      <div className="flex flex-col w-full justify-between h-12">
        <div className="flex justify-between">
          <div className="ml-5 w-1/3">
            <Input placeholder="search courses , assignments ..." />
          </div>
          <div className="flex items-center justify-center gap-7">
            <NotificationBell />
            <UserInfo user={user} />
          </div>
        </div>

        <div className="ml-5">
          <h1 className="text-3xl font-bold ">Profile</h1>
          <p className="mt-5">Find your relevant information</p>
        </div>
        {/* User info card */}
        <div className="bg-[#D9D9D942] w-[200px] flex justify-center items-center flex-col mt-5 ml-5 p-5 rounded-xl">
          {user ? (
            <>
              <div className="w-30 h-30 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 text-4xl font-semibold ">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <p className="font-medium text-l">{user.name}</p>
              <span className="text-s text-gray-500">{user.email}</span>
            </>
          ) : (
            <Loader />
          )}
        </div>

        {/* Detailed user informaition card */}
        <div className="bg-[#D9D9D942] w-[500px] flex flex-col mt-5 ml-5 p-5 roudend-xl">
          <div className="mb-10">
            <p className="text-3xl font-medium border-b-1 ">Personal Details</p>
          </div>
          <div className="flex gap-16">
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-xl font-serif">Full Name</p>
                <span className="text-xl font-bold">{user.name}</span>
              </div>
              <div>
                <p className="text-xl font-serif">Role</p>
                <span className="text-xl font-bold">{user.role}</span>
              </div>
            </div>
            <div>
              <p className="text-xl font-serif">Email</p>
              <span className="text-xl font-bold">{user.email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;