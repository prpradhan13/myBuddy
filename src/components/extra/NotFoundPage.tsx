import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-MainBackgroundColor">
      <h1 className="text-4xl font-bold text-red-500">404 - Page Not Found</h1>
      <p className="text-lg mt-2 text-white">Oops! The page you are looking for does not exist.</p>
      <Link to="/" replace className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
        Go to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
