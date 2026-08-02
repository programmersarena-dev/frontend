import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useStateContext } from "../../contexts/ContextProvider";
import { useTranslation } from "../../contexts/TranslationContext";

export default function ProblemsetSecondLevelMenu({ contestId }) {
  const { __ } = useTranslation();
  const { currentUser } = useStateContext();
  const location = useLocation();

  const navItems = useMemo(() => {
    const items = [
      {
        label: __("problem.problemset") || "Problemset",
        path: `/problemset`,
        show: true,
      },
      {
        label: __("problem.status") || "Status",
        path: `/problemset/status`,
        show: true,
      },
      {
        label: __("problem.standings") || "Standings",
        path: `/problemset/standings`,
        show: true,
      },
    ];

    return items.filter((item) => item.show);
  }, [contestId, currentUser?.email_verified_at, __]);

  return (
    <nav className="border-b border-slate-200 bg-white/50 backdrop-blur-sm">
      <div className="flex space-x-1 px-4 sm:px-6">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              aria-current={isActive ? "page" : undefined}
              className={`relative inline-flex items-center px-3.5 py-2.5 text-sm font-medium border-b-2 transition-all duration-200 ease-in-out ${
                isActive
                  ? "border-emerald-600 text-emerald-600 font-semibold"
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}