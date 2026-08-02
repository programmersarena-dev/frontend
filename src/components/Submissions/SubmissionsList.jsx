import React, { useState, useCallback, memo } from "react";
import FormatToUTC from "../core/FormatToUTC";
import UserCodeModal from "../UserCodeModal";
import axiosClient from "@/api/axios";
import SubmissionVerdict from "./SubmissionVerdict";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "../../contexts/TranslationContext";

export default function SubmissionsList({ submissions = [] }) {
  const { currentUser } = useAuth();
  const { __ } = useTranslation();

  const [userSubmission, setUserSubmission] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingSubmissionId, setLoadingSubmissionId] = useState(null);

  const fetchUserCode = useCallback((submissionId) => {
    setLoadingSubmissionId(submissionId);

    axiosClient
      .get(`/submissions/submission/${submissionId}`)
      .then((res) => {
        setUserSubmission(res.data);
        setIsModalOpen(true);
      })
      .catch((err) => {
        console.error("Failed to fetch user code:", err);
      })
      .finally(() => {
        setLoadingSubmissionId(null);
      });
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setUserSubmission(null);
  }, []);

  return (
    <>
      <UserCodeModal
        isOpen={isModalOpen}
        onClose={closeModal}
        userSubmission={userSubmission}
      />

      <div className="w-full rounded-lg shadow border border-gray-200 bg-white">
        <table className="w-full table-fixed text-center text-xs sm:text-sm border-collapse">
          <thead className="bg-gray-800 text-white select-none">
            <tr>
              <th className="w-[8%] py-2.5 px-1 font-semibold">#</th>
              <th className="w-[14%] py-2.5 px-2 font-semibold">{__("submission.nav-when")}</th>
              <th className="w-[14%] py-2.5 px-2 font-semibold">{__("submission.nav-user")}</th>
              <th className="w-[26%] py-2.5 px-2 font-semibold">{__("submission.nav-problem")}</th>
              <th className="w-[10%] py-2.5 px-1 font-semibold">{__("submission.nav-lang")}</th>
              <th className="w-[14%] py-2.5 px-1 font-semibold">{__("submission.nav-verdict")}</th>
              <th className="w-[7%] py-2.5 px-1 font-semibold">{__("submission.nav-time")}</th>
              <th className="w-[7%] py-2.5 px-1 font-semibold">{__("submission.nav-memory")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-gray-800">
            {submissions.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="py-6 text-center bg-gray-50 text-gray-500 font-medium"
                >
                  {__("submission.not-found")}
                </td>
              </tr>
            ) : (
              submissions.map((submission) => (
                <SubmissionRow
                  key={submission.id}
                  submission={submission}
                  currentUsername={currentUser?.name}
                  isLoading={loadingSubmissionId === submission.id}
                  onSubmissionClick={fetchUserCode}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* MEMOIZED ROW COMPONENT                                                     */
/* -------------------------------------------------------------------------- */

const SubmissionRow = memo(function SubmissionRow({
  submission,
  currentUsername,
  isLoading,
  onSubmissionClick,
}) {
  const isCurrentUser = currentUsername && currentUsername === submission.username;
  const problem = submission.problem || {};

  // Build clean problem link based on contest or archive availability
  const problemLink = problem.contest_id && problem.char
    ? `/problemset/problem/${problem.contest_id}/${problem.char}`
    : `/problemset/problem/${problem.id || problem.code}`;

  const problemDisplayName = problem.name
    ? `${problem.contest_id ? `${problem.contest_id}${problem.char || ''} - ` : ''}${problem.name}`
    : (submission.problem_id || "Problem");

  return (
    <tr
      className={`transition-colors duration-150 hover:bg-slate-50 ${
        isCurrentUser ? "bg-blue-50/50" : ""
      }`}
    >
      {/* Submission ID */}
      <td className="py-2 px-1 truncate">
        <button
          type="button"
          disabled={isLoading}
          className="text-blue-600 hover:text-blue-800 font-medium hover:underline disabled:opacity-50"
          onClick={() => onSubmissionClick(submission.id)}
        >
          {isLoading ? "..." : submission.id}
        </button>
      </td>

      {/* Date / Time */}
      <td className="py-2 px-2 truncate text-xs text-gray-600">
        <FormatToUTC dateTime={submission.created_at} />
      </td>

      {/* Username / Profile Link */}
      <td className="py-2 px-2 truncate font-medium">
        <Link
          to={`/profile/${submission.username}`}
          className="hover:text-blue-600 hover:underline"
          title={submission.username}
        >
          {submission.username}
        </Link>
      </td>

      {/* Problem Link */}
      <td className="py-2 px-2 text-left truncate">
        <Link
          to={problemLink}
          className="text-blue-600 hover:text-blue-800 hover:underline"
          title={problemDisplayName}
        >
          {problemDisplayName}
        </Link>
      </td>

      {/* Language */}
      <td className="py-2 px-1 truncate text-xs font-mono">
        {submission.language}
      </td>

      {/* Verdict */}
      <td className="py-2 px-1 truncate">
        <SubmissionVerdict verdict={submission.verdict || submission.status} />
      </td>

      {/* Execution Time */}
      <td className="py-2 px-1 truncate text-xs font-mono">
        {submission.time ?? "-"}
      </td>

      {/* Memory Consumption */}
      <td className="py-2 px-1 truncate text-xs font-mono">
        {submission.memory ?? "-"}
      </td>
    </tr>
  );
});