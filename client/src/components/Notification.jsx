import { useState } from "react";
import { FaBell } from "react-icons/fa";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([
    
  ]);
  const [open, setOpen] = useState(false);

  return (
    <div className="relative pt-5">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-black cursor-pointer hover:text-gray-800"
      >
        <FaBell className="text-2xl w-8 h-8" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-1.5">
            {notifications.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200">
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
