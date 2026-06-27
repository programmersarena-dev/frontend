import React, { useState, useEffect } from "react";
import { ChevronDoubleRightIcon, UserIcon, CalendarIcon, ClockIcon } from "@heroicons/react/24/outline";
import CountdownTimer from "@/components/core/CountdownTimer";
import { Link } from "react-router-dom";
import FormatToUTC from "@/components/core/FormatToUTC";
import UserContestRegisterButton from "@/components/Contest/UserContestRegisterButton";
import { useTranslation } from "@/contexts/TranslationContext";

export default function ContestItem({ contest, index }) {
  const { __ } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const startDate = new Date(contest.start_date);
    const endDate = new Date(contest.end_date);

    if (
      (contest.status === "notStarted" && currentDate > startDate) ||
      (contest.status === "started" && currentDate > endDate)
    ) {
      window.location.reload();
    }
  }, [currentDate, contest]);

  const totalParticipants =
    (contest.participants?.official?.length || 0) +
    (contest.participants?.unofficial?.length || 0);

  return (
    <tr className="bg-slate-950/40 hover:bg-slate-900/60 border-b border-slate-800/50 last:border-0 transition-colors duration-200">
      <td className="p-4 text-center">
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          {contest.type}
        </span>
      </td>

      <td className="p-4 max-w-xs">
        <div className="flex flex-col items-start gap-1.5">
          <span className="text-sm font-bold text-slate-100 tracking-tight">
            {contest.name}
          </span>
          {contest.status === "ended" && (
            <Link
              to={`/contest/${contest.id}`}
              className="inline-flex items-center text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <span>{__("contest.enter") || "Enter"}</span>
              <ChevronDoubleRightIcon className="w-3.5 h-3.5 ml-1" />
            </Link>
          )}
        </div>
      </td>

      <td className="p-4 text-center">
        <div className="flex flex-wrap justify-center gap-1.5 max-w-[150px] mx-auto">
          {contest.authors &&
            contest.authors.map((author) => (
              <Link
                key={author}
                to={`/profile/${author}`}
                className="text-xs font-medium text-slate-300 hover:text-indigo-400 border border-slate-800 bg-slate-900/50 px-2 py-0.5 rounded-md transition-colors"
              >
                {author}
              </Link>
            ))}
        </div>
      </td>

      <td className="p-4 text-center">
        <div className="inline-flex items-center gap-1.5 text-xs text-slate-300 bg-slate-900/40 border border-slate-800/60 px-2.5 py-1 rounded-xl">
          <CalendarIcon className="w-3.5 h-3.5 text-slate-500" />
          <FormatToUTC dateTime={contest.start_date} />
        </div>
      </td>

      <td className="p-4 text-center">
        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300">
          <ClockIcon className="w-3.5 h-3.5 text-slate-500" />
          <span>{contest.duration}</span>
        </div>
      </td>

      <td className="p-4 text-center">
        {contest.status === "ended" ? (
          <Link
            to={`/contest/${contest.id}/standings`}
            className="inline-flex text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            {__("contest.final-results") || "Final Standings"}
          </Link>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-medium text-slate-400">
              {contest.status === "started" && (
                <div className="flex flex-col gap-1">
                  <Link
                    to={`/contest/${contest.id}/standings`}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                  >
                    {__("contest.online-results") || "Online Standings"}
                  </Link>
                  <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 self-center">
                    {__("contest.running") || "Running"}
                  </span>
                </div>
              )}
              {contest.status === "notStarted" && (
                <span className="uppercase tracking-wider text-[10px] text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                  {__("contest.starts-in") || "Starts In"}
                </span>
              )}
            </span>
            <CountdownTimer
              dateString={contest.status === "started" ? contest.end_date : contest.start_date}
              className="text-xs font-mono font-bold text-slate-200 bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-800"
            />
          </div>
        )}
      </td>

      <td className="p-4 text-center">
        {contest.status === "ended" ? (
          <div className="inline-flex items-center gap-1.5 text-xs text-slate-400 font-medium bg-slate-900/60 border border-slate-800/80 px-2.5 py-1 rounded-xl">
            <UserIcon className="w-3.5 h-3.5 text-slate-500" />
            <span>{totalParticipants}</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            {contest.status === "started" ? (
              <>
                <Link
                  to={`/contest/${contest.id}`}
                  className="inline-flex items-center justify-center py-1.5 px-3 border border-transparent text-xs font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/40 active:bg-indigo-700 transition duration-200"
                >
                  <span>{__("contest.enter") || "Enter"}</span>
                  <ChevronDoubleRightIcon className="w-3.5 h-3.5 ml-1" />
                </Link>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] text-slate-500 font-medium">
                    {__("contest.registration-closed") || "Registration Closed"}
                  </span>
                  <div className="inline-flex items-center gap-1 text-xs text-slate-400 font-medium bg-slate-900/40 border border-slate-800/40 px-2 py-0.5 rounded-lg">
                    <UserIcon className="w-3 h-3 text-slate-500" />
                    <span>{totalParticipants}</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <UserContestRegisterButton contest={contest} />
                <div className="flex flex-col items-center gap-1.5 w-full">
                  <div className="inline-flex items-center gap-1 text-xs text-slate-400 font-medium bg-slate-900/60 border border-slate-800 px-2.5 py-0.5 rounded-lg">
                    <UserIcon className="w-3 h-3 text-slate-500" />
                    <span>{totalParticipants}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
                    <span>{__("contest.closes-in") || "Closes in"}</span>
                    <CountdownTimer
                      dateString={contest.start_date}
                      className="text-slate-400 font-mono"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </td>
    </tr>
  );
}