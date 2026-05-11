import { Link } from "react-router-dom";
import { FaHome, FaExclamationTriangle } from "react-icons/fa";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative">
            <h1 className="text-9xl md:text-[12rem] font-black text-gray-200 select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <FaExclamationTriangle className="text-6xl text-orange-500 animate-bounce" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <div className="space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Oops! Page Not Found
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              The page you're looking for seems to have wandered off into the digital wilderness. 
              Don't worry, it happens to the best of us!
            </p>
          </div>

          {/* Suggestions */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Here's what you can do:</h3>
            <ul className="space-y-2 text-left text-gray-600">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-secondary rounded-full" />
                Check the URL for any typos
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-secondary rounded-full" />
                Go back to the previous page
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-secondary rounded-full" />
                Visit our homepage to start fresh
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-secondary text-white font-semibold rounded-xl hover:bg-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <FaHome />
              Back to Dashboard
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-secondary hover:text-secondary transition-all duration-300"
            >
              Go Back
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need help? Contact our support team or visit our help center.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;