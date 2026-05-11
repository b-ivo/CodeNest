export default function Button({ 
  children, 
  onClick, 
  variant = "primary", 
  size = "md",
  type = "button", 
  disabled = false,
  loading = false,
  className = "",
  ...props 
}) {
  const baseClasses = "inline-flex items-center justify-center font-semibold transition-all duration-300 focus-ring disabled:opacity-50 disabled:cursor-not-allowed";
  
  const sizeClasses = {
    sm: "px-4 py-2 text-sm rounded-lg",
    md: "px-6 py-3 text-base rounded-xl",
    lg: "px-8 py-4 text-lg rounded-xl",
  };

  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary", 
    outline: "border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white",
    ghost: "text-primary hover:bg-primary/10",
    danger: "bg-danger text-white hover:bg-red-600 shadow-lg",
    success: "bg-success text-white hover:bg-green-600 shadow-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
}
