import React, { useMemo } from "react";
import ProgressBar from "../core/ProgressBar";
import { useTranslation } from "../../contexts/TranslationContext";

function SubmissionVerdict({ verdict, className = "" }) {
  const { __ } = useTranslation();

  const numericScore = useMemo(() => {
    if (verdict === null || verdict === undefined || verdict === "") return NaN;
    const parsed = Number(verdict);
    return Number.isInteger(parsed) && parsed >= 0 && parsed <= 100 ? parsed : NaN;
  }, [verdict]);

  const isNumeric = !Number.isNaN(numericScore);

  const getVerdictStyle = (v) => {
    if (!v) return "text-gray-800";
    if (v === "Accepted") return "text-green-800";
    if (v.startsWith("WA")) return "text-red-800";
    if (v.startsWith("TL")) return "text-yellow-800";
    if (v.startsWith("Compiling")) return "text-blue-800";
    if (v.startsWith("CE")) return "text-red-600";
    return "text-gray-800";
  };

  const getTestCaseNumber = (v) => {
    if (!v) return "";
    const parts = v.split(/[-–—]/).map((p) => p.trim());
    return parts.length > 1 ? parts[1] : "";
  };

  const getVerdictLabel = (v) => {
    if (!v) return "";

    if (v === "Accepted") {
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
    <div className={`font-semibold ${getVerdictStyle(verdict)} ${className}`}>
      {getVerdictLabel(verdict)}
    </div>
  );
}

export default React.memo(SubmissionVerdict);