import CountdownTimer from "../core/CountdownTimer";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "@/contexts/TranslationContext";

export default function ContestDetails({ contest }) {
  const { id } = useParams();
  const { __ } = useTranslation();
  const contestId = id || contest?.id;

  if (!contest) return null;

  const isEnded = contest.status === "ended" || contest.status === "past";
  const isStarted = contest.status === "started";

  return (
    <div className="border border-slate-100 rounded-xl p-4 space-y-3">
      {/* Contest Name */}
      <h3 className="text-[15px] font-medium text-slate-900 leading-snug">
        <Link
          to={`/contest/${contestId}`}
          className="hover:text-indigo-600 transition-colors"
        >
          {contest.name}
        </Link>
      </h3>

      {/* Status */}
      {isEnded ? (
        <div className="flex items-center justify-between">
          <span className="text-[10.5px] font-medium text-slate-400 uppercase tracking-wide">
            {__("contest.ended") || "Ended"}
          </span>
          <Link
            to={`/contest/${contestId}/standings`}
            className="text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors"
          >
            {__("contest.final-results") || "Final standings"}
          </Link>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <span className="text-[10.5px] font-medium text-slate-400 uppercase tracking-wide">
            {isStarted
              ? __("contest.ends-in") || "Ends in"
              : __("contest.starts-in") || "Starts in"}
          </span>
          <CountdownTimer
            dateString={isStarted ? contest.end_date : contest.start_date}
            className="text-xs font-mono font-semibold text-slate-800"
          />
        </div>
      )}
    </div>
  );
}