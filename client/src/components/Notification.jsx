import { useState } from "react";
import { FaBell } from "react-icons/fa";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([
    
  ]);
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2.5 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-xl transition-all duration-300 cursor-pointer"
      >
        <FaBell className="text-xl" />
        {notifications.length > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-white" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 glass-card bg-white/90 border border-slate-100 shadow-2xl z-50 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-bold text-slate-800">Notifications</h3>
            {notifications.length > 0 && <button className="text-[10px] font-bold text-primary hover:underline uppercase">Mark all as read</button>}
          </div>
          {notifications.length === 0 ? (
            <div className="p-4 text-sm text-gray-500">
              No new notifications
            </div>
          ) : (
            <ul className="max-h-60 overflow-y-auto">
              {notifications.map((note, idx) => (
                <li
                  key={idx}
                  className="p-3 text-sm text-gray-700 hover:bg-gray-200  last:border-none cursor-pointer"
                >
                  {note}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
