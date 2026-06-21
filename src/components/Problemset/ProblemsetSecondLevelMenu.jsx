import { Link, useLocation } from "react-router-dom";
import { useStateContext } from "../../contexts/ContextProvider";

export default function ContestSecondLevelMenu() {
  const { t } = useStateContext();
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
        {t("problem.problemset")}
      </Link>
      <Link
        to={`/problemset/status`}
        className={`font-semibold ${isActive(`/problemset/status`) ? "bg-gray-300" : ""} p-1 rounded hover:bg-gray-200 text-gray-700 transition duration-300 ease-in-out`}
      >
        {t("problem.status")}
      </Link>
      <Link
        to={`/problemset/standings`}
        className={`font-semibold ${isActive(`/problemset/standings`) ? "bg-gray-300" : ""} p-1 rounded hover:bg-gray-200 text-gray-700 transition duration-300 ease-in-out`}
      >
        {t("problem.standings")}
      </Link>
    </div>
  );
}
