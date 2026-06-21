import { useParams } from "react-router-dom";
import Loading from "../../components/core/Loading";
import NotFound from "../../components/core/NotFound";
import { useEffect, useState } from "react";
import axiosClient from "../../axios";
import FormatToUTC from "../../components/core/FormatToUTC";
import ProblemTests from "../../components/Problemset/ProblemTests";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";
import SubmissionVerdict from "../../components/Submissions/SubmissionVerdict";
import LanguageMapper from "../../components/Problemset/LanguageMapper";

export default function Submission() {
  const [loading, setLoading] = useState(true);
  const { id, submissionId } = useParams();
  const [submission, setSubmission] = useState({});

  useEffect(() => {
    axiosClient
      .get(`/submissions/submission/${submissionId}`)
      .then((res) => {
        setSubmission(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching problem:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (!submission.id) {
    return <NotFound />;
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold ">Umumy maglumatlar</h2>
        <div className="grid grid-cols-6 gap-4 p-4 bg-gray-100 rounded shadow text-center">
          <div className="font-semibold">#</div>
          <div className="font-semibold">Ulanyjy</div>
          <div className="font-semibold">Mesele</div>
          <div className="font-semibold">Dil</div>
          <div className="font-semibold">Netije</div>
          <div className="font-semibold">Ugradyldy</div>
          <div>{submission.id}</div>
          <div>
            <a href={`/profile/${submission.username}`}>{submission.username}</a>
          </div>
          <div>
            <a
              href={`/contest/${submission.contest.id}/problem/${submission.problem_char}`}
            >
              {submission.contest.id}
              {submission.problem_char}
            </a>
          </div>
          <div>{submission.language}</div>
          <div>
            <SubmissionVerdict verdict={submission.verdict} />
          </div>
          <div>
            <FormatToUTC dateTime={submission.sent_time} />
          </div>
        </div>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-bold">Kod</h2>
        <SyntaxHighlighter
          language={LanguageMapper({ language: submission.language })}
          style={darcula}
          showLineNumbers={true}
          wrapLines={true}
          className="rounded-lg overflow-auto"
        >
          {submission.code}
        </SyntaxHighlighter>
      </div>
      <div className="mb-4">
        {submission.outputs.length > 0 &&
          <ProblemTests
            tests={submission.outputs}
            subtasks={
              0 <= parseInt(submission.verdict) &&
                parseInt(submission.verdict) <= 100
                ? true
                : false
            }
          />
        }
      </div>
    </div>
  );
}
