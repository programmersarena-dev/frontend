import { useParams } from 'react-router-dom';
import Loading from '@/components/core/Loading';
import RequestError from '@/components/core/RequestError';
import SubmissionsList from '@/components/Submissions/SubmissionsList';
import PaginationLinks from '@/components/core/PaginationLinks';
import useSubmissionList from '@/hooks/useSubmissionList';

export default function ProblemSetStatusView() {
  const { id, char } = useParams();
  const url = id && char ? `/submissions?contest_id=${encodeURIComponent(id)}&char=${encodeURIComponent(char)}` : '/submissions';
  const { submissions, meta, loading, error, retry, onPageClick } = useSubmissionList(url);
  if (loading) return <Loading />;
  if (error) return <RequestError onRetry={retry} />;
  return (
    <div className="px-4">
      <SubmissionsList submissions={submissions} />
      {submissions.length > 0 && <PaginationLinks meta={meta} onPageClick={onPageClick} />}
    </div>
  );
}
