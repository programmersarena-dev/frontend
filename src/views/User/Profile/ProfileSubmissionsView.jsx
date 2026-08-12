import React, { useEffect, useState } from "react";
import axiosClient from "@/api/axios";
import Loading from "@/components/core/Loading";
import PaginationLinks from "@/components/core/PaginationLinks";
import { useLocation, useParams } from "react-router-dom";
import SubmissionsList from "@/components/Submissions/SubmissionsList";

export default function ProfileSubmissionsView() {
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [meta, setMeta] = useState({});
  const location = useLocation();
  const { handle } = useParams();

  const onPageClick = (link) => {
    getSubmissions(link.url);
  };

  const getSubmissions = (url) => {
    url = url || `/profile/${handle}/submissions`;
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
          submission.verdict === "Compiling" ||
          submission.verdict?.startsWith("Running")
      );

      compilingOrRunningSubmissions.forEach((submission) => {
        axiosClient
          .get(`/problemset/submission/${submission.id}`)
          .then((res) => {
            const updatedSubmission = res.data;
            setSubmissions((prevSubmissions) =>
              prevSubmissions.map((sub) =>
                sub.id === updatedSubmission.id
                  ? { ...sub, verdict: updatedSubmission.verdict }
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
    <div className="px-4 py-10 space-y-6">
      <SubmissionsList submissions={submissions} />

      {submissions.length > 0 && (
        <div className="flex justify-center pt-2">
          <PaginationLinks meta={meta} onPageClick={onPageClick} />
        </div>
      )}
    </div>
  );
}