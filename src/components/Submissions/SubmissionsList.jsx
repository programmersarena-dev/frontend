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

      <div className="w-full bg-white border-t border-b border-zinc-200">
        <table className="w-full table-fixed text-sm border-collapse">
          <thead>
            <tr className="border-b border-zinc-200">
              <th className="w-[7%] py-2.5 px-2 text-left text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                #
              </th>
              <th className="w-[13%] py-2.5 px-2 text-left text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                {__("submission.nav-when")}
              </th>
              <th className="w-[13%] py-2.5 px-2 text-left text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                {__("submission.nav-user")}
              </th>
              <th className="w-[27%] py-2.5 px-2 text-left text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                {__("submission.nav-problem")}
              </th>
              <th className="w-[9%] py-2.5 px-2 text-left text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                {__("submission.nav-lang")}
              </th>
              <th className="w-[13%] py-2.5 px-2 text-left text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                {__("submission.nav-verdict")}
              </th>
              <th className="w-[9%] py-2.5 px-2 text-right text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                {__("submission.nav-time")}
              </th>
              <th className="w-[9%] py-2.5 px-2 text-right text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                {__("submission.nav-memory")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {submissions.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="py-10 text-center text-zinc-400"
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
      className={`group transition-colors duration-100 hover:bg-zinc-50 ${
        isCurrentUser ? "relative bg-teal-50/40" : ""
      }`}
    >
      {/* Submission ID */}
      <td className="py-2 px-2 truncate relative">
        {isCurrentUser && (
          <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-teal-600" aria-hidden="true" />
        )}
        <button
          type="button"
          disabled={isLoading}
          className="font-mono tabular-nums text-zinc-500 hover:text-teal-700 disabled:opacity-40 transition-colors"
          onClick={() => onSubmissionClick(submission.id)}
        >
          {isLoading ? "…" : submission.id}
        </button>
      </td>

      {/* Date / Time */}
      <td className="py-2 px-2 truncate text-xs text-zinc-500 font-mono">
        <FormatToUTC dateTime={submission.created_at} />
      </td>

      {/* Username / Profile Link */}
      <td className="py-2 px-2 truncate font-medium">
        <Link
          to={`/profile/${submission.username}`}
          className="text-zinc-800 hover:text-teal-700 transition-colors"
          title={submission.username}
        >
          {submission.username}
        </Link>
      </td>

      {/* Problem Link */}
      <td className="py-2 px-2 truncate">
        <Link
          to={problemLink}
          className="text-zinc-700 hover:text-teal-700 hover:underline underline-offset-2 transition-colors"
          title={problemDisplayName}
        >
          {problemDisplayName}
        </Link>
      </td>

      {/* Language */}
      <td className="py-2 px-2 truncate text-xs font-mono text-zinc-500">
        {submission.language}
      </td>

      {/* Verdict */}
      <td className="py-2 px-2 truncate">
        <SubmissionVerdict verdict={submission.verdict || submission.status} />
      </td>

      {/* Execution Time */}
      <td className="py-2 px-2 truncate text-right text-xs font-mono tabular-nums text-zinc-500">
        {submission.time != null ? `${submission.time}ms` : "–"}
      </td>

      {/* Memory Consumption */}
      <td className="py-2 px-2 truncate text-right text-xs font-mono tabular-nums text-zinc-500">
        {submission.memory != null ? `${submission.memory}KB` : "–"}
      </td>
    </tr>
  );
});