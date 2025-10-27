import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import SideNavBar from "../components/SideNavBar";
import Input from "../components/Input";
import UserInfo from "../components/UserInfo";
import NotificationBell from "../components/Notification";

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

  if (loading)
    return (
      <div className="flex items-center justify-center">
        {" "}
        <Loader />{" "}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-row ">
      {/* Nav bar */}
      <div className="">
        <SideNavBar />
      </div>
      {/* The upper bar that contains search bar notification menu and the user information */}
      <div className="flex flex-row h-12 justify-between w-full">
        <div className="w-1/3 ml-5">
          <Input placeholder="search courses , assignments ..." />
        </div>
        <div className="flex gap-5">
          <NotificationBell />
          <UserInfo user={user} />
        </div>
      </div>
    </div>
  );
}
