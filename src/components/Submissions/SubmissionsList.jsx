import React, { useState } from "react";
import FormatToUTC from "../core/FormatToUTC";
import UserCodeModal from "../UserCodeModal";
import { useStateContext } from "../../contexts/ContextProvider";
import axiosClient from "../../axios";
import SubmissionVerdict from "./SubmissionVerdict";
import { Link } from "react-router-dom";

export default function SubmissionsList({ submissions }) {
  const { currentUser, t } = useStateContext();
  const [selectedSubmissionId, setSelectedSubmissionId] = useState(null);
  const [userSubmission, setUserSubmission] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUserCode = (submissionId) => {
    axiosClient
      .get(`/submissions/submission/${submissionId}`)
      .then((res) => {
        setUserSubmission(res.data);
        setIsModalOpen(true);
      })
      .catch((err) => {
        console.error("Failed to fetch user code:", err);
      });
  };

  const handleSubmissionClick = (submissionId) => {
    setSelectedSubmissionId(submissionId);
    fetchUserCode(submissionId);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <UserCodeModal
        isOpen={isModalOpen}
        onClose={closeModal}
        userSubmission={userSubmission}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden text-center text-sm">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-2 px-4">#</th>
              <th className="py-2 px-4">{t("submission.nav-when")}</th>
              <th className="py-2 px-4">{t("submission.nav-user")}</th>
              <th className="py-2 px-4">{t("submission.nav-problem")}</th>
              <th className="py-2 px-4">{t("submission.nav-lang")}</th>
              <th className="py-2 px-4">{t("submission.nav-verdict")}</th>
              <th className="py-2 px-4">{t("submission.nav-time")}</th>
              <th className="py-2 px-4">{t("submission.nav-memory")}</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {!submissions.length && (
              <tr>
                <td
                  colSpan="100%"
                  className="py-4 text-center bg-gray-200 text-gray-600"
                >
                  {t("submission.not-found")}
                </td>
              </tr>
            )}
            {submissions.map((submission) => (
              <tr
                key={submission.id}
                className={`${currentUser && currentUser.name === submission.username ? "bg-gray-100" : ""}`}
              >
                <td className="border py-2 px-4">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => handleSubmissionClick(submission.id)}
                  >
                    {submission.id}
                  </button>
                </td>
                <td className="border py-2 px-4">
                  <FormatToUTC dateTime={submission.created_at} />
                </td>
                <td className="border py-2 px-4">
                  <Link
                    to={`/profile/${submission.username}`}
                  >
                    {submission.username}
                  </Link>
                </td>
                <td className="border py-2 px-4">
                  <Link
                    to={`/problemset/problem/${submission.problem.contest_id}/${submission.problem.char}`}
                    className="text-blue-600 hover:underline"
                  >
                    {submission.problem.contest_id}
                    {submission.problem.char} - {submission.problem.name}
                  </Link>
                </td>
                <td className="border py-2 px-4">{submission.language}</td>
                <td className="border py-2 px-1 max-w-xs">
                  <SubmissionVerdict verdict={submission.verdict} />
                </td>
                <td className="border py-2 px-4">{submission.time}</td>
                <td className="border py-2 px-4">{submission.memory}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
