import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "@/api/axios";
import Loading from "@/components/core/Loading";
import NotFound from "@/components/core/NotFound";
import FormatToUTC from "@/components/core/FormatToUTC";
import ProblemTests from "@/components/Problemset/ProblemTests";
import SubmissionStatus from "@/components/Submissions/SubmissionStatus";
import LanguageMapper from "@/components/Problemset/LanguageMapper";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ClipboardIcon, CheckIcon } from "@heroicons/react/24/outline";

const Stat = ({ label, children }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-[10.5px] font-medium text-slate-400 uppercase tracking-wide">
      {label}
    </span>
    <span className="text-xs font-mono text-slate-700">{children}</span>
  </div>
);

export default function SubmissionView() {
  const [loading, setLoading] = useState(true);
  const { submissionId } = useParams();
  const [submission, setSubmission] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLoading(true);
    axiosClient
      .get(`/submissions/submission/${submissionId}`)
      .then((res) => {
        setSubmission(res.data.data);
      })
      .catch((error) => {
        console.error("Error fetching submission:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [submissionId]);

  // Safely ensure code is a string (handles objects, arrays, or nulls)
  const codeString =
    typeof submission?.code === "string"
      ? submission.code
      : typeof submission?.code === "object" && submission?.code !== null
        ? JSON.stringify(submission.code, null, 2)
        : String(submission?.code ?? "");

  // Safely ensure status is a string
  const statusString =
    typeof submission?.status === "string"
      ? submission.status
      : String(submission?.status ?? "");

  const handleCopyCode = () => {
    if (codeString) {
      navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!submission?.id) {
    return <NotFound />;
  }

  const numericVerdict = parseInt(statusString, 10);
  const isNumericVerdict =
    !isNaN(numericVerdict) && numericVerdict >= 0 && numericVerdict <= 100;

  const syntaxLanguage = LanguageMapper({
    language: typeof submission.language === "string" ? submission.language : "",
  });

  return (
    <div className="px-4 py-10 sm:px-6 space-y-8">
      <section className="space-y-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-1">
            <span className="text-[10.5px] font-medium text-slate-400 uppercase tracking-wide font-mono">
              Iberilme #{submission.id}
            </span>
            <div>
              <Link
                to={`/contest/${submission.contest?.id}/problem/${submission.problem_char}`}
                className="inline-flex items-baseline gap-1.5 text-[15px] font-medium text-slate-900 hover:text-indigo-600 transition-colors"
              >
                {typeof submission.contest?.name === "string"
                  ? submission.contest.name
                  : ""}
                <span className="text-slate-400 font-mono text-xs">
                  {typeof submission.problem_char === "string"
                    ? submission.problem_char
                    : "A"}
                </span>
              </Link>
            </div>
          </div>
          <SubmissionStatus status={statusString} />
        </div>

        <div className="flex flex-wrap gap-x-8 gap-y-3 py-4 border-y border-slate-100">
          <Stat label="Ulanyjy">
            <Link
              to={`/profile/${submission.handle}`}
              className="text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              {typeof submission.handle === "string" ? submission.handle : ""}
            </Link>
          </Stat>
          <Stat label="Dil">
            {typeof submission.language === "string" ? submission.language : ""}
          </Stat>
          <Stat label="Wagt">{submission.time ?? 0}</Stat>
          <Stat label="Ýady">{submission.memory ?? 0}</Stat>
          <Stat label="Ugradyldy">
            <FormatToUTC dateTime={submission.sent_time} />
          </Stat>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Kod</h2>
          <button
            onClick={handleCopyCode}
            type="button"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors"
          >
            {copied ? (
              <>
                <CheckIcon className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-600">Göçürildi</span>
              </>
            ) : (
              <>
                <ClipboardIcon className="h-3.5 w-3.5" />
                <span>Göçür</span>
              </>
            )}
          </button>
        </div>

        <div className="rounded-lg border border-slate-100 overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50/60 px-4 py-2 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>{syntaxLanguage}</span>
            <span>{codeString.split("\n").length} setir</span>
          </div>
          <SyntaxHighlighter
            language={syntaxLanguage}
            style={oneLight}
            showLineNumbers={true}
            wrapLines={true}
            customStyle={{
              margin: 0,
              padding: "1.25rem",
              fontSize: "0.8125rem",
              backgroundColor: "transparent",
            }}
          >
            {codeString}
          </SyntaxHighlighter>
        </div>
      </section>

      {Array.isArray(submission.outputs) && submission.outputs.length > 0 && (
        <section>
          <ProblemTests
            tests={submission.outputs}
            subtasks={isNumericVerdict}
          />
        </section>
      )}
    </div>
  );
}