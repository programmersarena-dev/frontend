import React, { useEffect, useState } from "react";
import axiosClient from "../../axios";
import Loading from "../../components/core/Loading";
import PaginationLinks from "../../components/core/PaginationLinks";
import { useLocation, useParams } from "react-router-dom";
import ProfileMenu from "../../components/Profile/ProfileMenu";
import SubmissionsList from "../../components/Submissions/SubmissionsList";

export default function ProfileSubmissions() {
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [meta, setMeta] = useState({});
  const location = useLocation();
  const { username } = useParams();

  const onPageClick = (link) => {
    getSubmissions(link.url);
  };

  const getSubmissions = (url) => {
    url = url || `/profile/${username}/submissions`;
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
          submission.verdict.startsWith("Running")
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
    <div>
      <SubmissionsList submissions={submissions} />

      {/* Pagination Links */}
      {submissions.length > 0 && (
        <PaginationLinks meta={meta} onPageClick={onPageClick} />
      )}
    </div>
  );
}
