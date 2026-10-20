import PropTypes from 'prop-types';
import { XMarkIcon } from '@heroicons/react/24/outline';
import UserSearch from './UserSearch';
import { useTranslation } from '@/contexts/TranslationContext';

export default function AdminContestAuthorList({ contest, setContest }) {
  const { __ } = useTranslation();
  return <div className="space-y-3">
    <UserSearch label={__('admin.contest.authors-label')} excluded={contest.authors}
      onSelect={(handle) => setContest((previous) => ({ ...previous, authors: [...previous.authors, handle] }))} />
    <div className="flex flex-wrap gap-2">
      {contest.authors.map((handle) => <button key={handle} type="button"
        aria-label={`${__('common.remove')} @${handle}`}
        onClick={() => setContest((previous) => ({ ...previous, authors: previous.authors.filter((value) => value !== handle) }))}
        className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs text-indigo-700">
        @{handle}<XMarkIcon aria-hidden="true" className="h-3 w-3" />
      </button>)}
    </div>
  </div>;
}

AdminContestAuthorList.propTypes = { contest: PropTypes.object.isRequired, setContest: PropTypes.func.isRequired };
