import { UserIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
import { Link, useLocation } from "react-router-dom";

export default function ProblemItem({ index, problem, contestId }) {
  const char = String.fromCharCode("A".charCodeAt(0) + index);
  const location = useLocation();

  const isAccepted = Boolean(problem?.accepted);

  return (
    <tr
      className={`border-b border-slate-100 transition-colors duration-150 hover:bg-slate-50/80 ${
        isAccepted ? "bg-emerald-50/40" : ""
      }`}
    >
      {/* Problem Index / ID (e.g. A, B, C) */}
      <td className="py-3.5 px-6 text-center font-bold text-slate-700">
        <span
          className={`inline-flex items-center justify-center h-8 w-8 rounded-lg text-sm ${
            isAccepted
              ? "bg-emerald-100 text-emerald-800 font-semibold"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          {char}
        </span>
      </td>

      {/* Problem Name & Status */}
      <td className="py-3.5 px-6 text-left">
        <Link
          to={`${location.pathname}/problem/${char}`}
          state={{ problemId: problem.id }}
          className="group inline-flex items-center space-x-2.5 text-sm font-medium text-slate-800 hover:text-emerald-600 transition-colors"
        >
          {isAccepted ? (
            <CheckCircleIcon className="h-5 w-5 text-emerald-500 shrink-0" />
          ) : (
            <span className="h-2 w-2 rounded-full bg-slate-300 group-hover:bg-emerald-400 transition-colors shrink-0" />
          )}
          <span className="group-hover:underline underline-offset-2">
            {problem.name}
          </span>
        </Link>
      </td>

      {/* Solved / Submissions Count */}
      <td className="py-3.5 px-6 text-center">
        <Link
          to={`/contest/${contestId}/problem/${char}/submissions`}
          className="inline-flex items-center space-x-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors bg-slate-100/70 hover:bg-slate-200/60 px-2.5 py-1 rounded-full"
          title="View submissions"
        >
          <UserIcon className="h-3.5 w-3.5 text-slate-400" />
          <span>{problem.accepted_submissions_count ?? 0}</span>
        </Link>
      </td>
    </tr>
  );
}