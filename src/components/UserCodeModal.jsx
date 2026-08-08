import { ClipboardIcon, LinkIcon, UserIcon, XMarkIcon } from "@heroicons/react/24/outline";
import ProblemTests from "./Problemset/ProblemTests";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import SubmissionVerdict from "./Submissions/SubmissionVerdict";
import { Link } from "react-router-dom";
import LanguageMapper from "./Problemset/LanguageMapper";
import { useTranslation } from "../contexts/TranslationContext";
import { useToast } from "../contexts/ToastContext";

const UserCodeModal = ({ isOpen, onClose, userSubmission }) => {
  const { addToast } = useToast();
  const { __ } = useTranslation();

  const copyToClipboard = (clipboardData, showText) => {
    navigator.clipboard
      .writeText(clipboardData)
      .then(() => {
        addToast(showText);
      })
      .catch((err) => {
        console.error("Failed to copy to clipboard:", err);
      });
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-5" onClick={onClose}>
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-6xl w-full max-h-full overflow-y-auto relative" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold flex items-center space-x-2">
                <Link
                  to={`/profile/${userSubmission.username}`}
                  className="flex items-center text-indigo-600 hover:underline"
                >
                  <UserIcon className="w-4 h-4" />
                  {userSubmission.username}
                </Link>
                <span>|</span>
                <SubmissionVerdict verdict={userSubmission.verdict} />
                <span>|</span>
                <button
                  className="flex items-center text-indigo-600 hover:underline"
                  onClick={() =>
                    copyToClipboard(
                      userSubmission.code,
                      __("submission.copy-code")
                    )
                  }
                >
                  <ClipboardIcon className="w-4 h-4" />
                  <span>{__("submission.code")}</span>
                </button>
                <span>|</span>
                <Link
                  to={`/contest/${userSubmission.contest.id}/submission/${userSubmission.id}`}
                  className="flex items-center text-indigo-600 hover:underline"
                >
                  <LinkIcon className="w-4 h-4" />
                  <span>{__("submission.ref")}</span>
                </Link>
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={onClose}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <hr className="mb-4" />
            <SyntaxHighlighter
              language={LanguageMapper({ language: userSubmission.language })}
              style={darcula}
              showLineNumbers={true}
              wrapLines={true}
              className="rounded-lg overflow-auto"
            >
              {userSubmission.code}
            </SyntaxHighlighter>
            <div className="mt-6">
              {userSubmission.outputs && userSubmission.outputs.length > 0 &&
                <ProblemTests
                  tests={userSubmission.outputs}
                  subtasks={(0 <= parseInt(userSubmission.verdict) && parseInt(userSubmission.verdict) <= 100) ? true : false} />
              }
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserCodeModal;
