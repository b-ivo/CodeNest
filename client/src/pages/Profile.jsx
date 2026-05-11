import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Input from "../components/Input";
import NotificationBell from "../components/Notification";
import UserInfo from "../components/UserInfo";
import Loader from "../components/Loader";

const Profile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Loader />
      </div>
    );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Top bar */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="w-full md:w-1/3">
          <Input placeholder="Search settings..." />
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
          <NotificationBell />
          <UserInfo user={user} />
        </div>
      </header>

      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Your <span className="text-gradient">Profile</span></h1>
        <p className="text-slate-500 font-medium mt-2">Manage your account settings and personal information.</p>
      </div>

      {/* Profile content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Card */}
        <div className="glass-card p-8 flex flex-col items-center text-center bg-white shadow-xl shadow-slate-200/50">
          <div className="w-32 h-32 rounded-2xl premium-gradient flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-primary/30 mb-6">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-2xl font-bold text-slate-800">{user?.name}</h2>
          <p className="text-primary font-bold uppercase tracking-widest text-[10px] mt-1 bg-primary/5 px-3 py-1 rounded-full">{user?.role}</p>
          <p className="text-slate-400 font-medium mt-4 text-sm">{user?.email}</p>
          
          <button className="mt-8 w-full py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all">Edit Avatar</button>
        </div>

        {/* Right Details Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-primary rounded-full" />
              Personal Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Full Name</p>
                <p className="text-lg font-bold text-slate-800">{user?.name}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Email Address</p>
                <p className="text-lg font-bold text-slate-800">{user?.email}</p>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Account Type</p>
                <p className="text-lg font-bold text-primary capitalize">{user?.role}</p>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Member Since</p>
                <p className="text-lg font-bold text-slate-800">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                    : "N/A"}
                </p>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-50 flex justify-end">
              <button className="px-8 py-3 rounded-xl bg-primary/10 text-primary font-bold hover:bg-primary hover:text-white transition-all duration-300">Update Details</button>
            </div>
          </div>
          
          <div className="bg-red-50 rounded-3xl p-8 border border-red-100">
            <h3 className="text-lg font-bold text-red-900">Danger Zone</h3>
            <p className="text-red-700/60 text-sm font-medium mt-1 mb-6">Irreversible actions for your account.</p>
            <button className="px-6 py-2.5 rounded-xl bg-white text-red-600 font-bold text-sm shadow-sm hover:shadow-md transition-all border border-red-200">Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
