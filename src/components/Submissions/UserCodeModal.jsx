import { useEffect } from "react";
import {
  ClipboardIcon,
  LinkIcon,
  UserIcon,
  XMarkIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";

import ProblemTests from "@/components/Problemset/ProblemTests";
import SubmissionStatus from "@/components/Submissions/SubmissionStatus";
import LanguageMapper from "@/components/Problemset/LanguageMapper";
import { useTranslation } from "@/contexts/TranslationContext";
import { useToast } from "@/contexts/ToastContext";

const UserCodeModal = ({ isOpen, onClose, userSubmission }) => {
  const { addToast } = useToast();
  const { __ } = useTranslation();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !userSubmission) return null;

  const copyToClipboard = (clipboardData, showText) => {
    navigator.clipboard
      .writeText(clipboardData)
      .then(() => addToast(showText))
      .catch((err) => console.error("Failed to copy:", err));
  };

  const numericVerdict = parseInt(userSubmission.verdict, 10);
  const isSubtaskGrading =
    !isNaN(numericVerdict) && numericVerdict >= 0 && numericVerdict <= 100;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transition-all transform"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to={`/profile/${userSubmission.handle}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-800 hover:text-indigo-600 transition-colors"
            >
              <UserIcon className="w-4 h-4 text-slate-500" />
              <span>{userSubmission.handle}</span>
            </Link>

            <span className="text-slate-300">•</span>

            <SubmissionStatus status={userSubmission.status} subtask={userSubmission.subtask} test={userSubmission.test} />

            <span className="text-slate-300">•</span>

            {userSubmission.contest?.id && (
              <Link
                to={`/contest/${userSubmission.contest.id}/submission/${userSubmission.id}`}
                className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors"
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>#{userSubmission.id}</span>
              </Link>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          <div className="overflow-hidden border border-slate-800 rounded-xl bg-[#2b2b2b] shadow-inner">
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#212121] border-b border-slate-700/50 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CodeBracketIcon className="w-4 h-4 text-slate-400" />
                <span className="font-mono font-medium text-slate-300">
                  {userSubmission.language || "Plain Text"}
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  copyToClipboard(
                    userSubmission.code,
                    __("submission.copy-code")
                  )
                }
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 rounded-md transition-all active:scale-95"
              >
                <ClipboardIcon className="w-3.5 h-3.5 text-slate-400" />
                <span>{__("submission.code")}</span>
              </button>
            </div>

            <div className="p-2 text-sm font-mono overflow-x-auto">
              <SyntaxHighlighter
                language={LanguageMapper({
                  language: userSubmission.language,
                })}
                style={darcula}
                showLineNumbers={true}
                wrapLines={true}
                customStyle={{
                  margin: 0,
                  padding: "1rem 0.5rem",
                  background: "transparent",
                  fontSize: "0.875rem",
                }}
              >
                {userSubmission.code || ""}
              </SyntaxHighlighter>
            </div>
          </div>

          {userSubmission.outputs && userSubmission.outputs.length > 0 && (
            <div className="pt-2">
              <ProblemTests
                tests={userSubmission.outputs}
                subtasks={isSubtaskGrading}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCodeModal;