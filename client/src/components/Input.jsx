export default function Input({
  type = "text",
  placeholder = "",
  value,
  onChange,
  name,
  autoComplete = "off",
  required = false,
  disabled = false,
  error = "",
  label = "",
  icon = null,
  className = "",
  ...props
}) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">{icon}</span>
          </div>
        )}
        
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          className={`input-field ${
            icon ? "pl-10" : ""
          } ${
            error ? "border-danger focus:ring-danger/20 focus:border-danger" : ""
          } ${
            disabled ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
          {...props}
        />
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-danger flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
