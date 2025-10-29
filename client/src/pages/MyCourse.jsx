import SideNavBar from "../components/SideNavBar";
import Input from "../components/Input";
import UserInfo from "../components/UserInfo";
import NotificationBell from "../components/Notification";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";

const MyCourses = () => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState();

  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_APIS;

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
      {/* Nav bar */}
      <div>
        <SideNavBar />
      </div>
      {/* Upper bar */}
      <div className="flex flex-col w-full justify-between h-12">
        <div></div>
        <div className="flex justify-between">
          <div className="ml-5 w-1/3">
            <Input placeholder="search courses , assignments ..." />
          </div>
          <div className="flex gap-7 ">
            <NotificationBell />
            <UserInfo user={user} onClick={() => navigate("/profile")} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCourses;
