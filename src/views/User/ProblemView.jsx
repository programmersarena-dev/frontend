import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "@/api/axios";
import Loading from "@/components/core/Loading";
import NotFound from "@/components/core/NotFound";
import PdfViewer from "@/components/core/PdfViewer";
import {
  DocumentDuplicateIcon,
  CheckIcon,
  ClockIcon,
  CpuChipIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "@/contexts/TranslationContext";
import { useToast } from "@/contexts/ToastContext";
import ProblemSidebar from "@/components/User/Problem/ProblemSidebar";

export default function ProblemView() {
  const { __ } = useTranslation();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [problem, setProblem] = useState(null);
  const [submissions, setSubmissions] = useState(null);
  const [contest, setContest] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);
  const { id, char } = useParams();

  const copyToClipboard = (text, toastMessage, key) => {
    if (!text) return;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        addToast(toastMessage);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy to clipboard:", err);
      });
  };

  useEffect(() => {
    setLoading(true);
    axiosClient
      .get(`/problems/problem/${id}/${char}`)
      .then(async (res) => {
        const data = res.data;
        setProblem(data.problem);
        setContest(data.contest);
        setSubmissions(data.submissions);

        if (data?.statement) {
          try {
            const response = await fetch(data.statement);
            const blob = await response.blob();
            setPdfUrl(URL.createObjectURL(blob));
          } catch (err) {
            console.error("Failed to load PDF statement:", err);
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching problem:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, char]);

  if (loading) return <Loading />;
  if (!problem || !problem.name) return <NotFound />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Main Content Column */}
        <div className="space-y-8 lg:col-span-2">
          {!problem.statement_url ? (
            <>
              {/* Problem Title & Constraints */}
              <div className="rounded-2xl bg-slate-50/70 p-6 sm:p-8">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {char}. {problem.name}
                </h1>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-medium text-slate-600">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-sm text-slate-700">
                    <ClockIcon className="h-4 w-4 text-slate-400" />
                    {__("problem.time-limit-per-test")}:{" "}
                    <strong className="text-slate-900">
                      {(problem.time_limit / 1000).toFixed(1)} s
                    </strong>
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-sm text-slate-700">
                    <CpuChipIcon className="h-4 w-4 text-slate-400" />
                    {__("problem.memory-limit-per-test")}:{" "}
                    <strong className="text-slate-900">
                      {problem.memory_limit} MB
                    </strong>
                  </span>
                </div>
              </div>

              {/* Problem Description */}
              {problem.description && (
                <section className="space-y-2">
                  <div
                    className="prose prose-slate max-w-none text-justify text-sm leading-relaxed text-slate-700"
                    dangerouslySetInnerHTML={{ __html: problem.description }}
                  />
                </section>
              )}

              {/* Input Format */}
              {problem.input && (
                <section className="space-y-2">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                    {__("problem.input")}
                  </h2>
                  <div
                    className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: problem.input }}
                  />
                </section>
              )}

              {/* Output Format */}
              {problem.output && (
                <section className="space-y-2">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                    {__("problem.output")}
                  </h2>
                  <div
                    className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: problem.output }}
                  />
                </section>
              )}

              {/* Example Test Cases */}
              {contest?.type !== "IOI" && (
                <section className="space-y-4">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                    {__("problem.test-cases")}
                  </h2>

                  {problem.example_test_cases &&
                    problem.example_test_cases.length > 0 ? (
                    <div className="space-y-4">
                      {problem.example_test_cases.map((testCase, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                        >
                          {/* Input Block */}
                          <div className="rounded-xl bg-slate-50/80 p-4">
                            <div className="mb-2 flex items-center justify-between">
                              <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                                {__("problem.input")}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  copyToClipboard(
                                    testCase.input,
                                    __("problem.copied-input"),
                                    `in-${index}`
                                  )
                                }
                                className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 text-xs font-medium text-slate-600 shadow-sm transition hover:text-indigo-600 active:scale-95"
                                title={__("problem.copy-input")}
                              >
                                 {copiedKey === `in-${index}` ? (
                                   <>
                                     <CheckIcon className="h-3.5 w-3.5 text-emerald-600" />
                                     <span className="text-emerald-600">{__("problem.copied")}</span>
                                   </>
                                 ) : (
                                   <>
                                     <DocumentDuplicateIcon className="h-3.5 w-3.5 text-slate-400" />
                                     <span>{__("problem.copy")}</span>
                                   </>
                                 )}
                              </button>
                            </div>
                            <pre className="overflow-x-auto rounded-lg bg-slate-900 p-3 font-mono text-xs text-slate-100 whitespace-pre-wrap leading-relaxed">
                              {testCase.input}
                            </pre>
                          </div>

                          {/* Output Block */}
                          <div className="rounded-xl bg-slate-50/80 p-4">
                            <div className="mb-2 flex items-center justify-between">
                              <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                                {__("problem.output")}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  copyToClipboard(
                                    testCase.output,
                                    __("problem.copied-output"),
                                    `out-${index}`
                                  )
                                }
                                className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 text-xs font-medium text-slate-600 shadow-sm transition hover:text-indigo-600 active:scale-95"
                                title={__("problem.copy-output")}
                              >
                                 {copiedKey === `out-${index}` ? (
                                   <>
                                     <CheckIcon className="h-3.5 w-3.5 text-emerald-600" />
                                     <span className="text-emerald-600">{__("problem.copied")}</span>
                                   </>
                                 ) : (
                                   <>
                                     <DocumentDuplicateIcon className="h-3.5 w-3.5 text-slate-400" />
                                     <span>{__("problem.copy")}</span>
                                   </>
                                 )}
                              </button>
                            </div>
                            <pre className="overflow-x-auto rounded-lg bg-slate-900 p-3 font-mono text-xs text-slate-100 whitespace-pre-wrap leading-relaxed">
                              {testCase.output}
                            </pre>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400">
                      {__("problem.test-not-found")}
                    </p>
                  )}
                </section>
              )}

              {/* Note Section */}
              {problem.note && (
                <section className="rounded-2xl bg-amber-50/50 p-6">
                  <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-700">
                    {__("problem.note")}
                  </h2>
                  <div
                    className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: problem.note }}
                  />
                </section>
              )}
            </>
          ) : (
            <div className="overflow-hidden rounded-2xl bg-slate-50/50">
              {pdfUrl || problem.statement_url ? (
                <PdfViewer file={pdfUrl || problem.statement_url} />
              ) : (
                <div className="flex h-64 items-center justify-center p-8 text-center text-sm text-slate-400">
                  {__("problem.loading-pdf")}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-1">
          <ProblemSidebar
            setLoading={setLoading}
            problem={problem}
            submissions={submissions}
            contest={contest}
          />
        </div>
      </div>
    </div>
  );
}