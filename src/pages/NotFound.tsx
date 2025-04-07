
import { Link } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";

const NotFound = () => {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
        <h1 className="text-5xl font-bold text-amber-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-amber-700 mb-6">Page Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link
          to="/"
          className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Return to Homepage
        </Link>
      </div>
    </MainLayout>
  );
};

export default NotFound;
