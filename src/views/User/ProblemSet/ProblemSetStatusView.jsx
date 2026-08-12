import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "@/api/axios";
import Loading from "@/components/core/Loading";
import SubmissionsList from "@/components/Submissions/SubmissionsList";
import PaginationLinks from "@/components/core/PaginationLinks";

export default function ProblemSetStatusView() {
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [meta, setMeta] = useState({});
  const { id, char } = useParams();

  const submissionsRef = useRef(submissions);
  submissionsRef.current = submissions;

  const getSubmissions = useCallback(
    (url) => {
      let targetUrl = url;

      if (!targetUrl) {
        if (id && char) {
          targetUrl = `/submissions?contest_id=${id}&char=${char}`;
        } else {
          targetUrl = `/submissions`;
        }
      }

      setLoading(true);

      axiosClient
        .get(targetUrl)
        .then((res) => {
          setSubmissions(res.data.data || []);
          setMeta(res.data.meta || {});
        })
        .catch((err) => {
          console.error("Failed to fetch submissions:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [id, char]
  );

  useEffect(() => {
    getSubmissions();
  }, [getSubmissions]);

  const onPageClick = (link) => {
    if (link?.url) {
      getSubmissions(link.url);
    }
  };

  useEffect(() => {
    const pollPendingSubmissions = async () => {
      const currentSubmissions = submissionsRef.current;

      const pendingSubmissions = currentSubmissions.filter((sub) =>
        sub.status?.startsWith("Compiling") ||
        sub.status?.startsWith("Running") ||
        sub.status?.startsWith("Queued") ||
        sub.status?.startsWith("Judging") ||
        sub.status === "Pending" ||
        sub.status === "0" ||
        sub.status === "Pending"
      );

      if (pendingSubmissions.length === 0) return;

      try {
        const updates = await Promise.all(
          pendingSubmissions.map((sub) =>
            axiosClient
              .get(`/submissions/submission/${sub.id}`)
              .then((res) => res.data)
              .catch((err) => {
                console.error(`Failed to poll submission ${sub.id}:`, err);
                return null;
              })
          )
        );

        setSubmissions((prevSubmissions) =>
          prevSubmissions.map((sub) => {
            const updated = updates.find((u) => u && u.id === sub.id);
            if (!updated) return sub;

            return {
              ...sub,
              verdict: updated.verdict ?? sub.verdict,
              status: updated.status ?? sub.status,
              time: updated.time ?? sub.time,
              memory: updated.memory ?? sub.memory,
            };
          })
        );
      } catch (error) {
        console.error("Error during polling:", error);
      }
    };

    const intervalId = setInterval(pollPendingSubmissions, 3000);

    return () => clearInterval(intervalId);
  }, []);

  if (loading && submissions.length === 0) {
    return <Loading />;
  }

  return (
    <div className="px-4">
      <SubmissionsList submissions={submissions} />

      {submissions.length > 0 && meta && (
        <PaginationLinks meta={meta} onPageClick={onPageClick} />
      )}
    </div>
  );
}