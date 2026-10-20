import { useState } from 'react';
import PropTypes from 'prop-types';
import { XMarkIcon } from '@heroicons/react/24/outline';
import UserSearch from './UserSearch';
import { useTranslation } from '@/contexts/TranslationContext';

export default function AdminContestOfficialCheckBox({ contest, setContest, handleInputChange }) {
  const { __ } = useTranslation();
  const [draft, setDraft] = useState({ type: contest.type, handles: [] });
  const handles = draft.type === contest.type ? draft.handles : [];
  const groupSize = contest.type === 'Duel' ? 2 : contest.type === 'ICPC' ? 4 : 1;
  const official = contest.participants?.official ?? [];
  const excluded = [...official.flat(), ...(contest.participants?.unofficial ?? []).flat(), ...handles];
  const select = (handle) => {
    const selected = [...handles, handle];
    if (selected.length < groupSize) {
      setDraft({ type: contest.type, handles: selected });
      return;
    }
    setContest((previous) => ({ ...previous, participants: { ...previous.participants,
      official: [...previous.participants.official, groupSize === 1 ? handle : selected] } }));
    setDraft({ type: contest.type, handles: [] });
  };
  return <div className="space-y-4">
    <label className="flex items-center gap-2 text-sm text-slate-700">
      <input type="checkbox" name="official" checked={contest.official} onChange={handleInputChange}
        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
      {__('admin.contest.official-label')}
    </label>
    {contest.official && <div className="space-y-3">
      <UserSearch label={`${__('admin.contest.official-participants')}${groupSize > 1 ? ` (${handles.length}/${groupSize})` : ''}`}
        excluded={excluded} onSelect={select} />
      <div className="flex flex-wrap gap-2">
        {handles.map((handle) => <button type="button" key={handle} aria-label={`${__('common.remove')} @${handle}`}
          onClick={() => setDraft({ type: contest.type, handles: handles.filter((value) => value !== handle) })}
          className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs text-indigo-700">
          @{handle}<XMarkIcon aria-hidden="true" className="h-3 w-3" />
        </button>)}
        {official.map((entry, index) => <button type="button" key={index}
          aria-label={`${__('common.remove')} ${[entry].flat().join(', ')}`}
          onClick={() => setContest((previous) => ({ ...previous, participants: { ...previous.participants,
            official: previous.participants.official.filter((_, position) => position !== index) } }))}
          className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
          {[entry].flat().map((handle) => `@${handle}`).join(' · ')}<XMarkIcon aria-hidden="true" className="h-3 w-3" />
        </button>)}
      </div>
    </div>}
  </div>;
}

AdminContestOfficialCheckBox.propTypes = { contest: PropTypes.object.isRequired, setContest: PropTypes.func.isRequired, handleInputChange: PropTypes.func.isRequired };
