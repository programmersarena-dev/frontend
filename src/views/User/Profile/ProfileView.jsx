import { useEffect, useRef, useState } from 'react';
import axiosClient from '@/api/axios';
import { Link, useParams } from 'react-router-dom';
import NotFound from '@/components/core/NotFound';
import RequestError from '@/components/core/RequestError';
import { UserIcon, TrophyIcon, CheckBadgeIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { useTranslation } from '@/contexts/TranslationContext';

export default function ProfileView() {
  const { currentUser } = useAuth();
  const { __ } = useTranslation();
  const { handle } = useParams();
  const { addToast } = useToast();
  const [attempt, setAttempt] = useState(0);
  const [profile, setProfile] = useState({ handle: null, user: null, loading: true, error: null });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const resendInFlight = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    setProfile({ handle, user: null, loading: true, error: null });
    axiosClient.get(`/profile/${encodeURIComponent(handle)}`, { signal: controller.signal })
      .then(({ data }) => {
        if (!controller.signal.aborted) setProfile({ handle, user: data.data, loading: false, error: null });
      }).catch((error) => {
        if (!controller.signal.aborted) setProfile({ handle, user: null, loading: false, error: error.response?.status || 500 });
      });
    return () => controller.abort();
  }, [handle, attempt]);

  const handleResend = async () => {
    if (resendInFlight.current || sent) return;
    resendInFlight.current = true;
    setSending(true);
    try {
      await axiosClient.post('/email/resend');
      setSent(true);
      addToast(__('user.profile.verification_sent'));
    } catch (error) {
      addToast(__(error.response?.status === 429 ? 'user.profile.verification_wait' : 'common.load_error'));
    } finally {
      resendInFlight.current = false;
      setSending(false);
    }
  };

  if (profile.loading || profile.handle !== handle) {
    return <div role="status" aria-label={__('common.loading')} className="mx-auto my-10 max-w-lg animate-pulse rounded-2xl border border-slate-100 p-8">
      <div className="mx-auto h-24 w-24 rounded-full bg-slate-100" />
      <div className="mx-auto mt-5 h-5 w-40 rounded bg-slate-100" />
      <div className="mt-8 h-24 rounded-xl bg-slate-50" />
    </div>;
  }
  if (profile.error === 404) return <NotFound />;
  if (profile.error) return <RequestError onRetry={() => setAttempt((value) => value + 1)} />;
  const { user } = profile;
  if (!user) return <NotFound />;
  const isOwnProfile = currentUser?.handle === handle;
  const online = user.is_online === 1;
  const info = [['first_name', user.first_name], ['last_name', user.last_name], ['country', user.country]];

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <article className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="h-20 bg-gradient-to-r from-indigo-50 via-slate-50 to-sky-50" aria-hidden="true" />
        <div className="px-6 pb-6 text-center">
          {user.image ? <img width="96" height="96" className="relative mx-auto -mt-12 h-24 w-24 rounded-full bg-white object-cover ring-4 ring-white" src={user.image} alt={user.name} /> :
            <div className="relative mx-auto -mt-12 flex h-24 w-24 items-center justify-center rounded-full bg-indigo-50 ring-4 ring-white"><UserIcon aria-hidden="true" className="h-10 w-10 text-indigo-300" /></div>}
          <h1 className="mt-4 text-xl font-semibold tracking-tight text-slate-900">{user.name}</h1>
          <p className="mt-1 text-sm text-slate-500">@{user.handle}</p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 text-xs text-slate-500">
            <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${online ? 'bg-emerald-500' : 'bg-slate-300'}`} />
            {__(online ? 'user.profile.online' : 'user.profile.offline')}
          </div>
          {isOwnProfile && <div className="mt-5">
            {currentUser.email_verified_at ? <Link to={`/profile/${user.handle}/edit`} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:border-indigo-200 hover:text-indigo-700">
              <PencilSquareIcon aria-hidden="true" className="h-4 w-4" />{__('user.profile.edit')}
            </Link> : <button type="button" onClick={handleResend} disabled={sending || sent} className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-500 disabled:cursor-default disabled:opacity-60">
              {__(sent ? 'user.profile.verification_sent' : sending ? 'common.sending' : 'user.profile.verify_email')}
            </button>}
          </div>}
        </div>
        <div className="grid grid-cols-2 border-y border-slate-100 bg-slate-50/60">
          <Link to={`/profile/${user.handle}/ratings`} className="border-r border-slate-100 p-5 text-center hover:bg-indigo-50/50">
            <TrophyIcon aria-hidden="true" className="mx-auto h-5 w-5 text-amber-500" />
            <span className="mt-2 block font-mono text-2xl font-semibold text-slate-900">{user.current_rating ?? 0}</span>
            <span className="text-xs text-slate-500">{__('user.profile.rating')}</span>
          </Link>
          <Link to={`/profile/${user.handle}/submissions`} className="p-5 text-center hover:bg-emerald-50/50">
            <CheckBadgeIcon aria-hidden="true" className="mx-auto h-5 w-5 text-emerald-500" />
            <span className="mt-2 block font-mono text-2xl font-semibold text-slate-900">{user.accepted_problems_count ?? 0}</span>
            <span className="text-xs text-slate-500">{__('user.profile.solved')}</span>
          </Link>
        </div>
        <div className="px-6 py-5">
          <h2 className="text-xs font-medium uppercase tracking-wide text-slate-400">{__('user.profile.info_title')}</h2>
          <dl className="mt-2 divide-y divide-slate-100">
            {info.map(([key, value]) => <div key={key} className="flex items-center justify-between gap-4 py-3 text-sm">
              <dt className="text-slate-500">{__(`user.profile.${key}`)}</dt><dd className="break-words text-right font-medium text-slate-800">{value || '—'}</dd>
            </div>)}
          </dl>
        </div>
      </article>
    </div>
  );
}
