export default function Input({
  type = "",
  placeholder = "",
  value,
  onChange,
  name,
  autoComplete = "off",
}) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      className="border rounded-full p-3 focus:outline-none focus:ring-blue-500 mt-2 mb-5 w-3/4"
    />
  );
}
