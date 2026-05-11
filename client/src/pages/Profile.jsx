import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import {
  FaEnvelope, FaEdit, FaSave, FaTimes, FaBook,
  FaClipboardList, FaCheckCircle, FaAward, FaGraduationCap,
  FaChalkboardTeacher, FaHistory, FaCalendar, FaUserCircle,
} from "react-icons/fa";

const ACTIVITY_CONFIG = {
  course_created:      { icon: <FaBook />,          color: "bg-blue-50 text-blue-600" },
  assignment_created:  { icon: <FaClipboardList />, color: "bg-purple-50 text-purple-600" },
  submission_received: { icon: <FaCheckCircle />,   color: "bg-green-50 text-green-600" },
  enrolled:            { icon: <FaGraduationCap />, color: "bg-blue-50 text-blue-600" },
  submitted:           { icon: <FaCheckCircle />,   color: "bg-green-50 text-green-600" },
  graded:              { icon: <FaAward />,          color: "bg-yellow-50 text-yellow-600" },
};

export default function Profile() {
  const { user, loading, refreshUser } = useAuth();
  const [editing, setEditing]           = useState(false);
  const [editName, setEditName]         = useState("");
  const [saving, setSaving]             = useState(false);
  const [saveMsg, setSaveMsg]           = useState("");
  const [activity, setActivity]         = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setEditName(user.name || "");
      fetchActivity();
    }
  }, [user]);

  const fetchActivity = async () => {
    setActivityLoading(true);
    try {
      const res = await fetch("/api/profile/activity", { credentials: "include" });
      const data = await res.json();
      if (res.ok) setActivity(data);
    } catch (err) {
      console.error(err);
    } finally {
      setActivityLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editName.trim() || editName.trim().length < 2) {
      setSaveMsg("⚠️ Name must be at least 2 characters.");
      return;
    }
    setSaving(true);
    setSaveMsg("");
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName.trim() }),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setSaveMsg("✅ Name updated successfully!");
        setEditing(false);
        await refreshUser();
      } else {
        setSaveMsg(`⚠️ ${data.message}`);
      }
    } catch {
      setSaveMsg("⚠️ Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader /></div>;

  const avatarGradient = user?.role === "teacher" ? "from-blue-600 to-purple-600" : "from-green-500 to-blue-600";
  const initial = (editing ? editName : user?.name)?.charAt(0)?.toUpperCase() || "?";

  return (
    <div className="space-y-8 fade-in">
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-8 card-shadow border border-gray-100">
        <h1 className="text-4xl font-bold text-gray-900">
          Your <span className="text-gradient">Profile</span>
        </h1>
        <p className="text-gray-600 text-lg mt-1">
          Manage your account information and view your recent activity.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Left Column ── */}
        <div className="space-y-6">
          {/* Avatar + Name Card */}
          <div className="bg-white rounded-2xl p-8 card-shadow border border-gray-100 text-center">
            <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4 shadow-lg`}>
              {initial}
            </div>

            {editing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSave()}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-center font-bold text-gray-900 focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                  maxLength={50}
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 py-2 bg-secondary text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-1 text-sm"
                  >
                    <FaSave /> {saving ? "Saving…" : "Save"}
                  </button>
                  <button
                    onClick={() => { setEditing(false); setEditName(user?.name || ""); setSaveMsg(""); }}
                    className="flex-1 py-2 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-1 text-sm"
                  >
                    <FaTimes /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  user?.role === "teacher" ? "bg-blue-50 text-blue-600" : "bg-green-50 text-green-600"
                }`}>
                  {user?.role}
                </span>
                <button
                  onClick={() => setEditing(true)}
                  className="mt-4 w-full py-2 px-4 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <FaEdit /> Edit Name
                </button>
              </>
            )}

            {saveMsg && (
              <p className={`text-sm mt-3 font-medium ${saveMsg.startsWith("✅") ? "text-green-600" : "text-orange-600"}`}>
                {saveMsg}
              </p>
            )}
          </div>

          {/* Account Details Card */}
          <div className="bg-white rounded-2xl p-6 card-shadow border border-gray-100 space-y-3">
            <h3 className="font-bold text-gray-900 text-lg mb-4">Account Details</h3>

            {[
              { icon: <FaEnvelope />, label: "Email", value: user?.email, color: "bg-blue-50 text-blue-600" },
              {
                icon: user?.role === "teacher" ? <FaChalkboardTeacher /> : <FaGraduationCap />,
                label: "Role", value: user?.role, color: user?.role === "teacher" ? "bg-blue-50 text-blue-600" : "bg-green-50 text-green-600",
              },
              {
                icon: <FaCalendar />, label: "Member Since",
                value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "N/A",
                color: "bg-purple-50 text-purple-600",
              },
            ].map(({ icon, label, value, color }) => (
              <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>{icon}</div>
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{label}</p>
                  <p className="text-sm font-semibold text-gray-800 capitalize">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Column: Activity Feed ── */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-8 card-shadow border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FaHistory className="text-secondary" />
              Recent Activity
            </h3>

            {activityLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4 animate-pulse">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-100 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : activity.length > 0 ? (
              <div className="space-y-2">
                {activity.map((item, i) => {
                  const cfg = ACTIVITY_CONFIG[item.type] || { icon: <FaHistory />, color: "bg-gray-50 text-gray-600" };
                  return (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
                        {cfg.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 leading-tight">{item.title}</p>
                        {item.subtitle && (
                          <p className="text-xs text-gray-500 mt-0.5">{item.subtitle}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <FaUserCircle className="text-5xl text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-600 mb-1">No Activity Yet</h4>
                <p className="text-gray-400 text-sm">
                  {user?.role === "teacher"
                    ? "Create courses and assignments to see your activity here."
                    : "Enroll in courses and submit assignments to see your activity here."}
                </p>
              </div>
            )}
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 rounded-2xl p-6 border border-red-100 mt-6">
            <h3 className="text-lg font-bold text-red-900">Danger Zone</h3>
            <p className="text-red-600/70 text-sm mt-1 mb-4">Irreversible actions for your account.</p>
            <button className="px-6 py-2.5 rounded-xl bg-white text-red-600 font-bold text-sm shadow-sm hover:shadow-md transition-all border border-red-200">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
