import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "@/contexts/TranslationContext";
import { useAuth } from "@/contexts/AuthContext";

export default function ContestSecondLevelMenu({ contestId }) {
  const { __ } = useTranslation();
  const { currentUser } = useAuth();
  const location = useLocation();

  const navItems = useMemo(() => {
    const items = [
      {
        label: __("contest.problems") || "Problems",
        path: `/contest/${contestId}`,
        show: true,
      },
      {
        label: __("contest.submit") || "Submit",
        path: `/contest/${contestId}/submit`,
        show: Boolean(currentUser?.email_verified_at),
      },
      {
        label: __("contest.standings") || "Standings",
        path: `/contest/${contestId}/standings`,
        show: true,
      },
    ];

    return items.filter((item) => item.show);
  }, [contestId, currentUser?.email_verified_at, __]);

  return (
    <nav className="border-b border-zinc-200 bg-white">
      <div className="flex px-2 sm:px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              aria-current={isActive ? "page" : undefined}
              className={`relative inline-flex items-center px-3 py-2.5 text-sm border-b-2 -mb-px transition-colors duration-150 ${
                isActive
                  ? "border-teal-600 text-zinc-900 font-medium"
                  : "border-transparent text-zinc-500 hover:text-zinc-800"
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