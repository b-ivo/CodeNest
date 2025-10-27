export default function Button({ children, onClick, variant = "primary", type="" }) {
  const base =
    "px-4 py-2 rounded-full font-medium transition-colors duration-500 mt-2 mb-5 w-3/4";

  const variants = {
    primary: "bg-[#161550] text-white hover:bg-blue-700 cursor-pointer flex justify-center items-center",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 cursor-pointer",
    danger: "bg-red-600 text-white hover:bg-red-700 cursor-pointer",
  };
  return (
    <button type={type} onClick={onClick} className={`${base} ${variants[variant]}`}>
      {children}
    </button>
  );
}
