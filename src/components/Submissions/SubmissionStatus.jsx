import React, { useMemo } from "react";
import ProgressBar from "../core/ProgressBar";
import { useTranslation } from "../../contexts/TranslationContext";

const STATUS_CONFIG = {
  AC: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200/60 ring-emerald-500/10",
    key: "submission.accepted",
  },
  WA: {
    badge: "bg-rose-50 text-rose-700 border-rose-200/60 ring-rose-500/10",
    key: "submission.wrong-answer",
  },
  TLE: {
    badge: "bg-amber-50 text-amber-700 border-amber-200/60 ring-amber-500/10",
    key: "submission.time-limit",
  },
  MLE: {
    badge: "bg-amber-50 text-amber-700 border-amber-200/60 ring-amber-500/10",
    key: "submission.memory-limit",
  },
  CE: {
    badge: "bg-rose-50 text-rose-700 border-rose-200/60 ring-rose-500/10",
    key: "submission.compilation-error",
  },
  RE: {
    badge: "bg-rose-50 text-rose-700 border-rose-200/60 ring-rose-500/10",
    key: "submission.runtime-error",
  },
  PENDING: {
    badge: "bg-indigo-50 text-indigo-700 border-indigo-200/60 ring-indigo-500/10",
    key: "submission.compiling",
    isAnimated: true,
  },
  JUDGING: {
    badge: "bg-indigo-50 text-indigo-700 border-indigo-200/60 ring-indigo-500/10",
    key: "submission.judging",
    isAnimated: true,
  },
  IN_QUEUE: {
    badge: "bg-indigo-50 text-indigo-700 border-indigo-200/60 ring-indigo-500/10",
    key: "submission.in-queue",
    isAnimated: true,
  },
  DEFAULT: {
    badge: "bg-slate-100 text-slate-700 border-slate-200 ring-slate-500/10",
  },
};

function SubmissionStatus({ status, subtask, test, className = "" }) {
  const { __ } = useTranslation();

  const numericScore = useMemo(() => {
    if (status === null || status === undefined || status === "") return null;
    const parsed = Number(status);
    return Number.isInteger(parsed) && parsed >= 0 && parsed <= 100 ? parsed : null;
  }, [status]);

  const parsedStatus = useMemo(() => {
    if (!status || typeof status !== "string") return null;

    const [rawCode, testNumRaw] = status.split(/[-–—]/).map((s) => s.trim());
    const code = rawCode.toUpperCase();

    let category = "DEFAULT";
    if (code === "AC") category = "AC";
    else if (code.startsWith("WA")) category = "WA";
    else if (code.startsWith("TLE")) category = "TLE";
    else if (code.startsWith("MLE")) category = "MLE";
    else if (code.startsWith("CE")) category = "CE";
    else if (code.startsWith("RE")) category = "RE";
    else if (
      code.startsWith("QUEUED")
    ) {
      category = "PENDING";
    }
    else if (code.startsWith("JUDGING")) category = "JUDGING";
    else if (code.startsWith("IN QUEUE")) category = "IN_QUEUE";

    return {
      category,
      testNum: testNumRaw || "",
      raw: status,
    };
  }, [status]);

  if (numericScore !== null) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="w-28 font-medium">
          <ProgressBar progress={numericScore} />
        </div>
      </div>
    );
  }

  if (!parsedStatus) return null;

  const config = STATUS_CONFIG[parsedStatus.category] || STATUS_CONFIG.DEFAULT;

  let label = config.key ? __(config.key) : parsedStatus.raw;
  if (subtask) {
    label += `, subtask-${subtask}`;
    if (test && test > 0) {
      label += `, test-${test}`;
    }
  } else if (parsedStatus.testNum) {
    label += `, test-${parsedStatus.testNum}`;
  }

  return (
    <div className={`inline-flex items-center ${className}`}>
      <span
        className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold ring-1 ring-inset transition-colors ${config.badge}`}
      >
        {config.isAnimated && (
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
          </span>
        )}
        {label}
      </span>
    </div>
  );
}

export default React.memo(SubmissionStatus);