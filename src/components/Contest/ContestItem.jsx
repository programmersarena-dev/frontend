import React, { useState, useEffect } from "react";
import {
  ChevronRightIcon,
  UserIcon,
  CalendarIcon,
  ClockIcon,
  TrophyIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";
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

  const totalParticipants =
    (contest.participants?.official?.length || 0) +
    (contest.participants?.unofficial?.length || 0);

  const isEnded = contest.status === "ended" || contest.status === "past";
  const isStarted = contest.status === "started";
  const isNotStarted = contest.status === "notStarted";

  return (
    <tr className="bg-white hover:bg-slate-50/70 border-b border-slate-100 last:border-0 transition-colors duration-150 text-slate-700">
      {/* Type Badge */}
      <td className="py-4 px-3 text-center align-middle">
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-500/10">
          {contest.type}
        </span>
      </td>

      {/* Contest Name & Direct Links */}
      <td className="py-4 px-4 align-middle max-w-xs">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-slate-900 tracking-tight leading-snug">
            {contest.name}
          </span>
          {isEnded && (
            <Link
              to={`/contest/${contest.id}`}
              className="inline-flex items-center gap-0.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors w-fit"
            >
              <span>{__("contest.enter") || "Enter Contest"}</span>
              <ChevronRightIcon className="w-3.5 h-3.5 stroke-[2]" />
            </Link>
          )}
        </div>
      </td>

      {/* Authors */}
      <td className="py-4 px-3 text-center align-middle">
        <div className="flex flex-wrap justify-center gap-1 max-w-[160px] mx-auto">
          {contest.authors && contest.authors.length > 0 ? (
            contest.authors.map((author) => (
              <Link
                key={author}
                to={`/profile/${author}`}
                className="text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100/80 hover:bg-slate-200/60 px-2 py-0.5 rounded-md transition-colors"
              >
                {author}
              </Link>
            ))
          ) : (
            <span className="text-xs text-slate-400">—</span>
          )}
        </div>
      </td>

      {/* Start Date */}
      <td className="py-4 px-3 text-center align-middle whitespace-nowrap">
        <div className="inline-flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200/60 px-2.5 py-1 rounded-lg font-mono">
          <CalendarIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <FormatToUTC dateTime={contest.start_date} />
        </div>
      </td>

      {/* Duration */}
      <td className="py-4 px-3 text-center align-middle whitespace-nowrap">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-600">
          <ClockIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{contest.duration}</span>
        </div>
      </td>

      {/* Status & Countdown */}
      <td className="py-4 px-3 text-center align-middle">
        {isEnded ? (
          <Link
            to={`/contest/${contest.id}/standings`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors bg-slate-50 hover:bg-indigo-50/50 px-3 py-1.5 rounded-lg border border-slate-200/70"
          >
            <TrophyIcon className="w-3.5 h-3.5 text-amber-500" />
            <span>{__("contest.final-results") || "Final Standings"}</span>
          </Link>
        ) : (
          <div className="flex flex-col items-center gap-1.5">
            {isStarted && (
              <div className="flex flex-col items-center gap-1">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {__("contest.running") || "Running"}
                </span>
                <Link
                  to={`/contest/${contest.id}/standings`}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  {__("contest.online-results") || "Online Standings"}
                </Link>
              </div>
            )}

            {isNotStarted && (
              <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20">
                {__("contest.starts-in") || "Starts In"}
              </span>
            )}

            <CountdownTimer
              dateString={isStarted ? contest.end_date : contest.start_date}
              className="text-xs font-mono font-bold text-slate-800 bg-slate-100/80 px-2.5 py-1 rounded-md border border-slate-200/80"
            />
          </div>
        )}
      </td>

      {/* Participants & Registration */}
      <td className="py-4 px-4 text-center align-middle">
        {isEnded ? (
          <div className="inline-flex items-center gap-1.5 text-xs text-slate-600 font-medium bg-slate-50 border border-slate-200/60 px-2.5 py-1 rounded-lg">
            <UserIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{totalParticipants}</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            {isStarted ? (
              <>
                <Link
                  to={`/contest/${contest.id}`}
                  className="inline-flex items-center justify-center gap-1 py-1.5 px-3.5 text-xs font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-sm"
                >
                  <PlayIcon className="w-3.5 h-3.5 fill-current" />
                  <span>{__("contest.enter") || "Enter"}</span>
                </Link>
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-[10px] text-slate-400 font-medium">
                    {__("contest.registration-closed") || "Registration Closed"}
                  </span>
                  <div className="inline-flex items-center gap-1 text-xs text-slate-600 font-medium bg-slate-50 px-2 py-0.5 rounded border border-slate-200/60">
                    <UserIcon className="w-3 h-3 text-slate-400" />
                    <span>{totalParticipants}</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <UserContestRegisterButton contest={contest} />
                <div className="flex flex-col items-center gap-1 w-full">
                  <div className="inline-flex items-center gap-1 text-xs text-slate-600 font-medium bg-slate-50 px-2.5 py-0.5 rounded-md border border-slate-200/60">
                    <UserIcon className="w-3 h-3 text-slate-400" />
                    <span>{totalParticipants}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                    <span>{__("contest.closes-in") || "Closes in"}</span>
                    <CountdownTimer
                      dateString={contest.start_date}
                      className="text-slate-600 font-mono"
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