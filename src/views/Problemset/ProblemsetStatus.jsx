import { useEffect, useState, useCallback, useRef } from "react";
import axiosClient from "@/api/axios";
import Loading from "../../components/core/Loading";
import { useParams } from "react-router-dom";
import SubmissionsList from "../../components/Submissions/SubmissionsList";
import PaginationLinks from "../../components/core/PaginationLinks";

export default function ProblemsetStatus() {
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [meta, setMeta] = useState({});
  const { id, char } = useParams();

  // Ref to hold current submissions state for polling without triggering re-effects
  const submissionsRef = useRef(submissions);
  submissionsRef.current = submissions;

  // Memoized fetch function
  const getSubmissions = useCallback(
    (url) => {
      let targetUrl = url;

      if (!targetUrl) {
        targetUrl = (!id && !char)
          ? "/submissions"
          : `/submissions/problem/${id}-${char}`;
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

  // Initial load & URL parameter dependency effect
  useEffect(() => {
    getSubmissions();
  }, [getSubmissions]);

  // Handle pagination clicks
  const onPageClick = (link) => {
    if (link?.url) {
      getSubmissions(link.url);
    }
  };

  // Polling Effect for pending / compiling submissions
  useEffect(() => {
    const pollPendingSubmissions = async () => {
      const currentSubmissions = submissionsRef.current;

      // Filter submissions that are still pending/compiling
      const pendingSubmissions = currentSubmissions.filter((sub) =>
        sub.status?.startsWith("Compiling") ||
        sub.status?.startsWith("Running") ||
        sub.status?.startsWith("Queued") ||
        sub.status === "Pending" ||
        sub.status === "0" ||
        sub.status === "Pending"
      );

      if (pendingSubmissions.length === 0) return;

      try {
        // Poll each pending submission
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

        // Update state in batch
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

    // Set up 3-second polling interval
    const intervalId = setInterval(pollPendingSubmissions, 3000);

    return () => clearInterval(intervalId);
  }, []); // Run interval setup once; relies on submissionsRef for dynamic data

  if (loading && submissions.length === 0) {
    return <Loading />;
  }

  return (
    <div className="px-4">
      <SubmissionsList submissions={submissions} />

      {/* Pagination Links */}
      {submissions.length > 0 && meta && (
        <PaginationLinks meta={meta} onPageClick={onPageClick} />
      )}
    </div>
  );
}