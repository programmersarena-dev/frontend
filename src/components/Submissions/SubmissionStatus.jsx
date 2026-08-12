import React, { useMemo } from "react";
import ProgressBar from "../core/ProgressBar";
import { useTranslation } from "../../contexts/TranslationContext";

function SubmissionStatus({ status, className = "" }) {
  const { __ } = useTranslation();

  const numericScore = useMemo(() => {
    if (status === null || status === undefined || status === "") return NaN;
    const parsed = Number(status);
    return Number.isInteger(parsed) && parsed >= 0 && parsed <= 100 ? parsed : NaN;
  }, [status]);

  const isNumeric = !Number.isNaN(numericScore);

  const getStatusStyle = (v) => {
    if (!v) return "text-gray-800";
    if (v === "AC") return "text-green-800";
    if (v.startsWith("WA")) return "text-red-800";
    if (v.startsWith("TLE")) return "text-yellow-800";
    if (v.startsWith("MLE")) return "text-yellow-800";
    if (v.startsWith("Compiling")) return "text-blue-800";
    if (v.startsWith("CE")) return "text-red-600";
    if (v.startsWith("RE")) return "text-red-600";
    return "text-gray-800";
  };

  const getTestCaseNumber = (v) => {
    if (!v) return "";
    const parts = v.split(/[-–—]/).map((p) => p.trim());
    return parts.length > 1 ? parts[1] : "";
  };

  const getStatusLabel = (v) => {
    if (!v) return "";

    if (v === "AC") {
      return __("submission.accepted");
    }

    if (v.startsWith("WA")) {
      const testNum = getTestCaseNumber(v);
      return testNum
        ? `${__("submission.wrong-answer")}, test-${testNum}`
        : __("submission.wrong-answer");
    }

    if (v.startsWith("TL")) {
      const testNum = getTestCaseNumber(v);
      return testNum
        ? `${__("submission.time-limit")}, test-${testNum}`
        : __("submission.time-limit");
    }

    if (v.startsWith("CE")) {
      return __("submission.compilation-error");
    }

    if (v.startsWith("Compiling")) {
      const testNum = getTestCaseNumber(v);
      return testNum
        ? `${__("submission.compiling")}, test-${testNum}`
        : __("submission.compiling");
    }

    return v;
  };

  if (isNumeric) {
    return (
      <div className="flex items-center justify-center">
        <div className="w-32 font-semibold">
          <ProgressBar progress={numericScore} />
        </div>
      </div>
    );
  }

  return (
    <div className={`font-semibold ${getStatusStyle(status)} ${className}`}>
      {getStatusLabel(status)}
    </div>
  );
}

export default React.memo(SubmissionStatus);