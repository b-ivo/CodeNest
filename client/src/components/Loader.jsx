export default function Loader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        {/* Logo */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6 shadow-lg">
          C
        </div>
        
        {/* Spinner */}
        <div className="relative">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-secondary rounded-full animate-spin mx-auto mb-4"></div>
        </div>
        
        {/* Text */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">Loading CodeNest</h3>
          <p className="text-sm text-gray-500">Please wait while we prepare your learning environment...</p>
        </div>
        
        {/* Progress dots */}
        <div className="flex justify-center gap-1 mt-6">
          {[0, 1, 2].map((i) => (
            <div 
              key={i}
              className="w-2 h-2 bg-secondary rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
