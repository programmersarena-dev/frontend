import { Link, useLocation } from "react-router-dom";
import { useStateContext } from "../../contexts/ContextProvider";
import { useTranslation } from "../../contexts/TranslationContext";

export default function ContestSecondLevelMenu({ contestId }) {
  const { __ } = useTranslation();
  const { currentUser } = useStateContext();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="flex space-x-4 px-6 text-sm">
      <Link
        to={`/contest/${contestId}`}
        className={`font-semibold ${isActive(`/contest/${contestId}`) ? "bg-gray-300" : ""} p-1 rounded hover:bg-gray-200 text-gray-700 transition duration-300 ease-in-out`}
      >
        {__("contest.problems")}
      </Link>
      {currentUser?.email_verified_at && (
        <Link
          to={`/contest/${contestId}/submit`}
          className={`font-semibold ${isActive(`/contest/${contestId}/submit`) ? "bg-gray-300" : ""} p-1 rounded hover:bg-gray-200 text-gray-700 transition duration-300 ease-in-out`}
        >
          {__("contest.submit")}
        </Link>
      )}
      <Link
        to={`/contest/${contestId}/standings`}
        className={`font-semibold ${isActive(`/contest/${contestId}/standings`) ? "bg-gray-300" : ""} p-1 rounded hover:bg-gray-200 text-gray-700 transition duration-300 ease-in-out`}
      >
        {__("contest.standings")}
      </Link>
    </div>
  );
}
