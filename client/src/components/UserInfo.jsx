export default function UserInfo({ user, onClick }) {
  if (!user) return null;

  return (
    <div 
      className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-xl transition-all duration-300 group border border-gray-100" 
      onClick={onClick}
    >
      {/* User Avatar */}
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-105 transition-transform">
        {user.name?.charAt(0).toUpperCase()}
      </div>

      {/* User Details */}
      <div className="flex flex-col text-left hidden sm:flex">
        <span className="text-sm font-semibold text-gray-900 group-hover:text-secondary transition-colors">
          {user.name}
        </span>
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          {user.role}
        </span>
      </div>
    </div>
  );
}
