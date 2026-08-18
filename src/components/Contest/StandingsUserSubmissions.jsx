import React from "react";
import SubmissionStatus from "../Submissions/SubmissionStatus";
import CalculateDiff from "../core/CalculateDiff";
import { Link } from "react-router-dom";

const StandingsUserSubmissions = ({
  isOpen,
  onClose,
  submissions,
  contestId,
  contestStartDate,
}) => {

  return (
    <>
      {isOpen && submissions.data.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-2xl mx-4 p-6 rounded-lg shadow-lg max-h-[80vh] overflow-y-auto">
            <div className="flex text-3xl justify-end items-center mb-4">
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={onClose}
              >
                &times;
              </button>
            </div>
            <>
              {submissions.data &&
                submissions.data.map((submission, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CalculateDiff startDate={contestStartDate} endDate={submission.created_at} />
                    <SubmissionStatus status={submission.status} subtask={submission.subtask} test={submission.test} />
                    <div>&rarr;</div>
                    <Link
                      to={`/contest/${contestId}/submission/${submission.id}`}
                      className="text-blue-500 underline"
                    >
                      {submission.id}
                    </Link>
                  </div>
                ))}
            </>
          </div>
        </div>
      )}
    </>
  );
};

export default StandingsUserSubmissions;
