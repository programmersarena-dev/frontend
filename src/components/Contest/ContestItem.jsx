import React, { useState, useEffect } from "react";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import CountdownTimer from "@/components/core/CountdownTimer";
import { Link } from "react-router-dom";
import FormatToUTC from "@/components/core/FormatToUTC";
import UserContestRegisterButton from "@/components/Contest/UserContestRegisterButton";
import { useTranslation } from "@/contexts/TranslationContext";

export default function ContestItem({ contest, index }) {
  const { __ } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const totalParticipants =
    (contest.participants?.official?.length || 0) +
    (contest.participants?.unofficial?.length || 0);

  const isEnded = contest.status === "Ended";
  const isStarted = contest.status === "Active";
  const isNotStarted = contest.status === "Pending";

  return (
    <div className="group flex flex-col gap-3 py-4 px-1 border-b border-slate-100 last:border-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      {/* Left: identity + meta */}
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex items-baseline gap-2">
          <span className="text-[10.5px] font-semibold tracking-wide text-slate-400 uppercase shrink-0">
            {contest.type}
          </span>
          {!isNotStarted ? (
            <Link
              to={`/contest/${contest.id}`}
              className="inline-flex items-baseline gap-1 text-[13.5px] font-medium text-slate-900 leading-snug hover:text-indigo-600 transition-colors truncate"
            >
              <span className="truncate">{contest.name}</span>
              {isEnded && (
                <ArrowUpRightIcon className="w-3 h-3 text-slate-300 group-hover:text-indigo-500 translate-y-[1px] shrink-0" />
              )}
            </Link>
          ) : (
            <div
              className="inline-flex items-baseline gap-1 text-[13.5px] font-medium text-slate-900 leading-snug hover:text-indigo-600 transition-colors truncate"
            >
              <span className="truncate">{contest.name}</span>
              {isEnded && (
                <ArrowUpRightIcon className="w-3 h-3 text-slate-300 group-hover:text-indigo-500 translate-y-[1px] shrink-0" />
              )}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
          <span className="font-mono text-slate-500">
            <FormatToUTC dateTime={contest.start_date} />
          </span>
          <span className="text-slate-300">·</span>
          <span className="font-mono text-slate-500">{contest.duration}</span>

          {contest.authors && contest.authors.length > 0 && (
            <>
              <span className="text-slate-300">·</span>
              <span className="flex flex-wrap items-center gap-x-1.5">
                {contest.authors.map((author, i) => (
                  <React.Fragment key={author}>
                    <Link
                      to={`/profile/${author}`}
                      className="hover:text-slate-900 transition-colors"
                    >
                      {author}
                    </Link>
                    {i < contest.authors.length - 1 && (
                      <span className="text-slate-300">,</span>
                    )}
                  </React.Fragment>
                ))}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Right: status + action */}
      <div className="flex items-center justify-between gap-6 sm:justify-end sm:shrink-0">
        {isEnded ? (
          <>
            <Link
              to={`/contest/${contest.id}/standings`}
              className="text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors"
            >
              {__("contest.final-results") || "Final standings"}
            </Link>
            <span className="text-xs font-mono text-slate-400 w-10 text-right shrink-0">
              {totalParticipants}
            </span>
          </>
        ) : (
          <>
            <div className="flex flex-col items-start sm:items-end gap-0.5">
              <div className="flex items-center gap-1.5">
                {isStarted && (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                )}
                <span className="text-[10.5px] font-medium text-slate-400 uppercase tracking-wide">
                  {isStarted
                    ? __("contest.running") || "Running"
                    : __("contest.starts-in") || "Starts in"}
                </span>
              </div>
              <CountdownTimer
                dateString={isStarted ? contest.end_date : contest.start_date}
                className="text-xs font-mono font-medium text-slate-800"
              />
            </div>

            <div className="flex flex-col items-end gap-0.5 shrink-0">
              {isStarted ? (
                <Link
                  to={`/contest/${contest.id}`}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  {__("contest.enter") || "Enter"}
                </Link>
              ) : (
                <UserContestRegisterButton
                  contest={contest}
                  className="text-xs font-semibold text-slate-900 hover:text-indigo-600 transition-colors"
                />
              )}
              <span className="text-[11px] font-mono text-slate-400">
                {totalParticipants}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}