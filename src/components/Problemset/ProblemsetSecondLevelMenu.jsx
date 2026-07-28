import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "../../contexts/TranslationContext";

export default function ContestSecondLevelMenu() {
  const { __ } = useTranslation();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="flex space-x-4 px-6 text-sm">
      <Link
        to={`/problemset`}
        className={`font-semibold ${isActive(`/problemset`) ? "bg-gray-300" : ""} p-1 rounded hover:bg-gray-200 text-gray-700 transition duration-300 ease-in-out`}
      >
        {__("problem.problemset")}
      </Link>
      <Link
        to={`/problemset/status`}
        className={`font-semibold ${isActive(`/problemset/status`) ? "bg-gray-300" : ""} p-1 rounded hover:bg-gray-200 text-gray-700 transition duration-300 ease-in-out`}
      >
        {__("problem.status")}
      </Link>
      <Link
        to={`/problemset/standings`}
        className={`font-semibold ${isActive(`/problemset/standings`) ? "bg-gray-300" : ""} p-1 rounded hover:bg-gray-200 text-gray-700 transition duration-300 ease-in-out`}
      >
        {__("problem.standings")}
      </Link>
    </div>
  );
}
