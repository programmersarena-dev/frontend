import CountdownTimer from "../core/CountdownTimer";
import { Link, useParams } from "react-router-dom";
import { ClockIcon } from "@heroicons/react/24/outline";

export default function ContestDetails({ contest }) {
  const { id } = useParams();
  const contestId = id || contest?.id;

  if (!contest) return null;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all">
      {/* Contest Header / Link */}
      <h3 className="text-lg font-semibold text-slate-900 tracking-tight leading-snug">
        <Link
          to={`/contest/${contestId}`}
          className="hover:text-emerald-600 transition-colors duration-150"
        >
          {contest.name}
        </Link>
      </h3>

      {/* Divider */}
      <div className="my-4 h-px bg-slate-100" />

      {/* Countdown Timer Block */}
      <div className="flex items-center justify-between gap-2 rounded-xl bg-slate-50/80 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-600 border border-slate-100">
        <div className="flex items-center gap-1.5 text-slate-400">
          <ClockIcon className="h-4 w-4 shrink-0 text-slate-500" />
          <span>Ends in:</span>
        </div>
        <CountdownTimer
          dateString={contest.end_date}
          className="font-mono text-slate-800 font-semibold"
        />
      </div>
    </div>
  );
}