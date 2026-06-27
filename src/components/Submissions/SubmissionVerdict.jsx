import React from "react";
import ProgressBar from "../core/ProgressBar";
import { useStateContext } from "../../contexts/ContextProvider";

export default function SubmissionVerdict({ verdict, className }) {
  const { t } = useStateContext();
  return (
    <>
      {!parseInt(verdict) && verdict !== "0" && (
        <div
          className={`font-semibold ${verdict === "Accepted"
            ? "text-green-800"
            : verdict?.startsWith("WA")
              ? "text-red-800"
              : verdict?.startsWith("TL")
                ? "text-yellow-800"
                : verdict?.startsWith("Compiling")
                  ? "text-blue-800"
                  : "text-gray-800"
            } ${className}`}
        >
          {verdict === "Accepted"
            ? t("submission.accepted")
            : verdict?.startsWith("WA")
              ? t("submission.wrong-answer") + ", test-" + verdict.split("-")[1]
              : verdict?.startsWith("TL")
                ? t("submission.time-limit") + ", test - " + verdict.split(" - ")[1]
                : verdict?.startsWith("CE")
                  ? t("submission.compilation-error")
                  : verdict?.startsWith("Compiling")
                    ? (verdict.split("-").length > 1 ? t("submission.compiling") + ", test-" + verdict.split("-")[1] : t("submission.compiling"))
                    : verdict}
        </div>
      )}
      {0 <= parseInt(verdict) &&
        parseInt(verdict) <= 100 && (
          <div className="flex items-center justify-center">
            <div className="w-32 font-semibold">
              <ProgressBar progress={parseInt(verdict)} />
            </div>
          </div>
        )}
    </>
  );
}
