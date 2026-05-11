export default function UserInfo({ user, onClick }) {
  if (!user) return null;

  return (
    <div className="flex items-center gap-4 cursor-pointer hover:bg-slate-100 p-2 rounded-2xl transition-all duration-300 group" onClick={onClick}>
      {/* User Details */}
      <div className="flex flex-col text-right hidden sm:flex">
        <span className="text-sm font-bold text-slate-800 group-hover:text-primary transition-colors">{user.name}</span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{user.role}</span>
      </div>

      {/* User Avatar */}
      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
        {user.name?.charAt(0).toUpperCase()}
      </div>
    </div>
  );
}
