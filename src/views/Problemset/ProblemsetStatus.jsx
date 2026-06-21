import { useEffect, useState } from "react";
import axiosClient from "../../axios";
import Loading from "../../components/core/Loading";
import { useLocation, useParams } from "react-router-dom";
import SubmissionsList from "../../components/Submissions/SubmissionsList";
import PaginationLinks from "../../components/core/PaginationLinks";

export default function ProblemsetStatus() {
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [meta, setMeta] = useState({});
  const { id, char } = useParams();
  const location = useLocation();

  const onPageClick = (link) => {
    getSubmissions(link.url);
  };

  const getSubmissions = (url) => {
    if (!id && !char) {
      url = url || "/submissions";
    } else {
      url = url || `/submissions/problem/${id}-${char}`;
    }
    axiosClient
      .get(url)
      .then((res) => {
        setSubmissions(res.data.data);
        setMeta(res.data.meta);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch submissions:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    getSubmissions();
  }, [location.pathname]);

  useEffect(() => {
    const pollSubmissions = () => {
      const compilingOrRunningSubmissions = submissions.filter(
        (submission) =>
          submission.verdict.startsWith("Compiling")
      );

      compilingOrRunningSubmissions.forEach((submission) => {
        axiosClient
          .get(`/submissions/submission/${submission.id}`)
          .then((res) => {
            const updatedSubmission = res.data;
            setSubmissions((prevSubmissions) =>
              prevSubmissions.map((sub) =>
                sub.id === updatedSubmission.id
                  ? { ...sub, verdict: updatedSubmission.verdict, time: updatedSubmission.time,memory: updatedSubmission.memory}
                  : sub
              )
            );
          })
          .catch((err) => {
            console.error(`Failed to fetch submission ${submission.id}:`, err);
          });
      });
    };

    if (submissions.length > 0) {
      const interval = setInterval(pollSubmissions, 5000);
      return () => clearInterval(interval);
    }
  }, [submissions]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="px-4">
      <SubmissionsList submissions={submissions} />

      {/* Pagination Links */}
      {submissions.length > 0 && (
        <PaginationLinks meta={meta} onPageClick={onPageClick} />
      )}
    </div>
  );
}
