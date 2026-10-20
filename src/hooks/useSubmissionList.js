import { useEffect, useState } from 'react';
import axiosClient from '@/api/axios';

const pending = /^(queued|in queue|pending|compiling|running|judging)/i;

export default function useSubmissionList(baseUrl) {
  const [page, setPage] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState({ url: null, submissions: [], meta: {}, loading: true, error: false });
  const url = page?.base === baseUrl ? page.url : baseUrl;

  useEffect(() => {
    const controller = new AbortController();
    setState({ url, submissions: [], meta: {}, loading: true, error: false });
    axiosClient.get(url, { signal: controller.signal }).then(({ data }) => {
      if (!controller.signal.aborted) {
        setState({ url, submissions: data.data ?? [], meta: data.meta ?? {}, loading: false, error: false });
      }
    }).catch(() => {
      if (!controller.signal.aborted) setState({ url, submissions: [], meta: {}, loading: false, error: true });
    });
    return () => controller.abort();
  }, [url, attempt]);

  useEffect(() => {
    if (state.loading || state.url !== url) return;
    const ids = state.submissions.filter((sub) => sub.can_poll && pending.test(String(sub.status))).map((sub) => sub.id);
    if (!ids.length) return;
    const controller = new AbortController();
    let timer;
    let failures = 0;
    const poll = async () => {
      if (controller.signal.aborted) return;
      if (document.hidden) {
        timer = setTimeout(poll, 3000);
        return;
      }
      try {
        const { data } = await axiosClient.get('/submissions/statuses', {
          params: { ids }, signal: controller.signal,
        });
        if (controller.signal.aborted) return;
        const updates = new Map(data.data.map((update) => [update.id, update]));
        setState((previous) => ({ ...previous, submissions: previous.submissions.map((sub) =>
          updates.has(sub.id) ? { ...sub, ...updates.get(sub.id) } : sub) }));
      } catch {
        if (!controller.signal.aborted) {
          failures += 1;
          timer = setTimeout(poll, Math.min(30000, 3000 * 2 ** failures));
        }
      }
    };
    timer = setTimeout(poll, 3000);
    return () => { controller.abort(); clearTimeout(timer); };
  }, [state, url]);

  return {
    ...state,
    loading: state.loading || state.url !== url,
    onPageClick: (link) => { if (link?.url) setPage({ base: baseUrl, url: link.url }); },
    retry: () => setAttempt((value) => value + 1),
  };
}
