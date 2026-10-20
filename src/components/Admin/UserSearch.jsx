import { useEffect, useId, useState } from 'react';
import PropTypes from 'prop-types';
import axiosClient from '@/api/axios';
import { useTranslation } from '@/contexts/TranslationContext';

export default function UserSearch({ label, onSelect, excluded = [] }) {
  const { __ } = useTranslation();
  const id = useId();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState({ query: '', users: [], loading: false, error: false });
  useEffect(() => {
    const controller = new AbortController();
    if (!query.trim()) return () => controller.abort();
    setResult({ query, users: [], loading: true, error: false });
    const timer = setTimeout(() => {
      axiosClient.get('/admin/users', { params: { q: query }, signal: controller.signal })
        .then(({ data }) => {
          if (!controller.signal.aborted) setResult({ query, users: data, loading: false, error: false });
        }).catch(() => {
          if (!controller.signal.aborted) setResult({ query, users: [], loading: false, error: true });
        });
    }, 300);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [query]);
  const users = result.query === query ? result.users.filter((user) => !excluded.includes(user.handle)) : [];
  return <div className="space-y-2">
    <label htmlFor={id} className="block text-xs font-medium text-slate-500">{label}</label>
    <input id={id} value={query} onChange={(event) => setQuery(event.target.value)} maxLength={64} autoComplete="off"
      placeholder={__('common.search_users')} className="block w-full rounded-lg border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500" />
    {query.trim() && <div className="max-h-48 overflow-y-auto rounded-lg border border-slate-100" aria-live="polite">
      {users.map((user) => <button key={user.id} type="button" onClick={() => { onSelect(user.handle); setQuery(''); }}
        className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-indigo-50 focus:bg-indigo-50">
        <span className="font-medium text-slate-800">@{user.handle}</span><span className="truncate text-slate-400">{user.name}</span>
      </button>)}
      {!users.length && <p className="px-3 py-2 text-xs text-slate-500">{__(result.loading || result.query !== query ? 'common.loading' : result.error ? 'common.load_error' : 'common.no_users')}</p>}
    </div>}
  </div>;
}

UserSearch.propTypes = { label: PropTypes.string.isRequired, onSelect: PropTypes.func.isRequired, excluded: PropTypes.arrayOf(PropTypes.string) };
