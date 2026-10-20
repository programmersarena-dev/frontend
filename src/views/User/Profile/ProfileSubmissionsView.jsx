import { useParams } from 'react-router-dom';
import Loading from '@/components/core/Loading';
import RequestError from '@/components/core/RequestError';
import PaginationLinks from '@/components/core/PaginationLinks';
import SubmissionsList from '@/components/Submissions/SubmissionsList';
import useSubmissionList from '@/hooks/useSubmissionList';

export default function ProfileSubmissionsView() {
  const { handle } = useParams();
  const { submissions, meta, loading, error, retry, onPageClick } = useSubmissionList(`/profile/${encodeURIComponent(handle)}/submissions`);
  if (loading) return <Loading />;
  if (error) return <RequestError onRetry={retry} />;
  return (
    <div className="px-4 py-10 space-y-6">
      <SubmissionsList submissions={submissions} />
      {submissions.length > 0 && <PaginationLinks meta={meta} onPageClick={onPageClick} />}
    </div>
  );
}
