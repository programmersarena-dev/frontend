import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "@/api/axios";
import Loading from "../../components/core/Loading";
import NotFound from "../../components/core/NotFound";
import FormatToUTC from "../../components/core/FormatToUTC";
import ProblemTests from "../../components/Problemset/ProblemTests";
import SubmissionVerdict from "../../components/Submissions/SubmissionVerdict";
import LanguageMapper from "../../components/Problemset/LanguageMapper";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ClipboardIcon, CheckIcon } from "@heroicons/react/24/outline";

export default function Submission() {
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* General Details Section */}
      <section>
        <h2 className="mb-4 text-2xl font-semibold tracking-tight text-slate-900">
          Umumy maglumatlar
        </h2>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th scope="col" className="px-6 py-3.5">#</th>
                  <th scope="col" className="px-6 py-3.5">Ulanyjy</th>
                  <th scope="col" className="px-6 py-3.5">Mesele</th>
                  <th scope="col" className="px-6 py-3.5">Dil</th>
                  <th scope="col" className="px-6 py-3.5">Netije</th>
                  <th scope="col" className="px-6 py-3.5 text-right">Ugradyldy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="transition-colors hover:bg-slate-50/50">
                  <td className="whitespace-nowrap px-6 py-4 font-mono font-medium text-slate-900">
                    #{submission.id}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <Link
                      to={`/profile/${submission.username}`}
                      className="font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
                    >
                      {submission.username}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <Link
                      to={`/contest/${submission.contest?.id}/problem/${submission.problem_char}`}
                      className="inline-flex items-center gap-1 font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
                    >
                      <span>{submission.contest?.id}</span>
                      <span className="rounded bg-indigo-50 px-1.5 py-0.5 font-bold text-indigo-700">
                        {submission.problem_char}
                      </span>
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 border border-slate-200">
                      {submission.language}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <SubmissionVerdict verdict={submission.status} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-slate-500 font-mono text-xs">
                    <FormatToUTC dateTime={submission.sent_time} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Code Editor Block Section */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            Kod
          </h2>
          <button
            onClick={handleCopyCode}
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {copied ? (
              <>
                <CheckIcon className="h-4 w-4 text-emerald-600" />
                <span className="text-emerald-600">Göçürildi!</span>
              </>
            ) : (
              <>
                <ClipboardIcon className="h-4 w-4 text-slate-500" />
                <span>Kody göçür</span>
              </>
            )}
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
          <div className="border-b border-slate-200 bg-slate-100/80 px-4 py-2 flex items-center justify-between text-xs font-mono text-slate-500">
            <span>{LanguageMapper({ language: submission.language })}</span>
            <span>{submission.code?.split("\n").length ?? 0} setir</span>
          </div>
          <SyntaxHighlighter
            language={LanguageMapper({ language: submission.language })}
            style={oneLight}
            showLineNumbers={true}
            wrapLines={true}
            customStyle={{
              margin: 0,
              padding: "1.25rem",
              fontSize: "0.875rem",
              backgroundColor: "transparent",
            }}
          >
            {submission.code || ""}
          </SyntaxHighlighter>
        </div>
      </section>

      {/* Test Case Outputs Section */}
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