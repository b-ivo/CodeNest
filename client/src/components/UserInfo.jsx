export default function UserInfo({ user }) {
  if (!user) return null;

  return (
    <div className="flex items-center gap-3 cursor-pointer">
      {/* User Avatar */}
      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold">
        {user.name?.charAt(0).toUpperCase()}
      </div>

      {/* User Details */}
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-800">{user.name}</span>
        <span className="text-xs text-gray-500">{user.email}</span>
      </div>
    </div>
  );
}
