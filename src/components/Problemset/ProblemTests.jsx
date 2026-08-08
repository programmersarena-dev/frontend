import React, { useState } from "react";
import { useTranslation } from "../../contexts/TranslationContext";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

// A single test case row — verdict, timing, and an optional expandable
// input/output/expected panel (useful for debugging a WA/RE, and the
// data is already present in the response, just previously discarded).
const TestRow = ({ test, testIndex, __ }) => {
  const [open, setOpen] = useState(false);
  const isOk = test.log === "OK";
  const hasDetail = test.input != null || test.output != null || test.expected_output != null;

  return (
    <div className="border border-slate-100 rounded-lg overflow-hidden">
      <div
        className={`flex items-center justify-between px-3 py-2 text-xs ${
          hasDetail ? "cursor-pointer hover:bg-slate-50/70" : ""
        } transition-colors`}
        onClick={() => hasDetail && setOpen((v) => !v)}
      >
        <div className="flex items-center gap-2 min-w-0">
          {hasDetail && (
            <ChevronDownIcon
              className={`h-3 w-3 text-slate-300 shrink-0 transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          )}
          <span className="font-medium text-slate-600 shrink-0">
            {__("submission.test") || "Test"} #{testIndex + 1}
          </span>
        </div>

        <div className="flex items-center gap-4 font-mono text-slate-400 shrink-0">
          <span>{test.time_used_ms} ms</span>
          <span>{test.memory_used_kb} KB</span>
          <span className={`font-semibold ${isOk ? "text-emerald-600" : "text-rose-500"}`}>
            {test.log}
          </span>
        </div>
      </div>

      {open && hasDetail && (
        <div className="border-t border-slate-100 bg-slate-50/60 px-3 py-3 space-y-2.5">
          {test.input != null && (
            <div>
              <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wide mb-1">
                {__("submission.input") || "Input"}
              </div>
              <pre className="text-[11px] font-mono text-slate-700 bg-white border border-slate-100 rounded px-2.5 py-2 overflow-x-auto whitespace-pre-wrap">
                {test.input}
              </pre>
            </div>
          )}
          {test.output != null && (
            <div>
              <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wide mb-1">
                {__("submission.output") || "Output"}
              </div>
              <pre className="text-[11px] font-mono text-slate-700 bg-white border border-slate-100 rounded px-2.5 py-2 overflow-x-auto whitespace-pre-wrap">
                {test.output}
              </pre>
            </div>
          )}
          {test.expected_output != null && (
            <div>
              <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wide mb-1">
                {__("submission.expected") || "Expected"}
              </div>
              <pre className="text-[11px] font-mono text-slate-700 bg-white border border-slate-100 rounded px-2.5 py-2 overflow-x-auto whitespace-pre-wrap">
                {test.expected_output}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function ProblemTests({ tests, subtasks }) {
  const { __ } = useTranslation();
  const [openSubtasks, setOpenSubtasks] = useState({ 0: true });

  const toggleSubtask = (index) => {
    setOpenSubtasks((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-900">
        {__("submission.tester") || "Test results"}
      </h3>

      {tests && tests.length > 0 && tests.map((subtask, index) => {
        const subTests = subtask.subTaskResults || [];
        const isOpen = !!openSubtasks[index];

        return (
          <div key={index} className="border border-slate-100 rounded-xl overflow-hidden">
            <div
              className="cursor-pointer flex items-center justify-between px-4 py-3 hover:bg-slate-50/50 transition-colors"
              onClick={() => toggleSubtask(index)}
            >
              <div className="flex items-center gap-2">
                <ChevronDownIcon
                  className={`h-3.5 w-3.5 text-slate-300 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
                <span className="text-sm font-medium text-slate-900">
                  {__("submission.subtask") || "Subtask"} #{index + 1}
                </span>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {subtask.point} {__("submission.points") || "pts"}
              </span>
            </div>

            {isOpen && (
              <div className="border-t border-slate-100 p-3 space-y-2 bg-white">
                {subTests.length > 0 ? (
                  subTests.map((test, testIndex) => (
                    <TestRow key={testIndex} test={test} testIndex={testIndex} __={__} />
                  ))
                ) : (
                  <div className="text-xs text-slate-400 px-1 py-1">
                    {__("submission.no-tests") || "No test data"}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}