import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "@/api/axios";
import Loading from "@/components/core/Loading";
import NotFound from "@/components/core/NotFound";
import FormatToUTC from "@/components/core/FormatToUTC";
import ProblemTests from "@/components/Problemset/ProblemTests";
import SubmissionVerdict from "@/components/Submissions/SubmissionVerdict";
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
        setSubmission(res.data);
      })
      .catch((error) => {
        console.error("Error fetching submission:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [submissionId]);

  const handleCopyCode = () => {
    if (submission?.code) {
      navigator.clipboard.writeText(submission.code);
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

  const isNumericVerdict =
    !isNaN(parseInt(submission.verdict, 10)) &&
    parseInt(submission.verdict, 10) >= 0 &&
    parseInt(submission.verdict, 10) <= 100;

  const syntaxLanguage = LanguageMapper({ language: submission.language });

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
                {submission.contest?.name}
                <span className="text-slate-400 font-mono text-xs">
                  {submission.problem_char}
                </span>
              </Link>
            </div>
          </div>
          <SubmissionVerdict verdict={submission.status} />
        </div>

        <div className="flex flex-wrap gap-x-8 gap-y-3 py-4 border-y border-slate-100">
          <Stat label="Ulanyjy">
            <Link
              to={`/profile/${submission.username}`}
              className="text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              {submission.username}
            </Link>
          </Stat>
          <Stat label="Dil">{submission.language}</Stat>
          <Stat label="Wagt">{submission.time}</Stat>
          <Stat label="Ýady">{submission.memory}</Stat>
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
            <span>{submission.code?.split("\n").length ?? 0} setir</span>
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
            {submission.code || ""}
          </SyntaxHighlighter>
        </div>
      </section>

      {submission.outputs && submission.outputs.length > 0 && (
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