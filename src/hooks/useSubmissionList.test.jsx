import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import axiosClient from '@/api/axios';
import useSubmissionList from './useSubmissionList';

vi.mock('@/api/axios', () => ({ default: { get: vi.fn() } }));
afterEach(() => { cleanup(); vi.useRealTimers(); });

it('aborts stale profile requests and ignores responses that arrive out of order', async () => {
  const requests = [];
  axiosClient.get.mockImplementation((url, { signal }) => new Promise((resolve) => requests.push({ url, signal, resolve })));
  const { result, rerender } = renderHook(({ url }) => useSubmissionList(url), { initialProps: { url: '/profile/a/submissions' } });
  rerender({ url: '/profile/b/submissions' });
  expect(requests[0].signal.aborted).toBe(true);
  await act(async () => requests[1].resolve({ data: { data: [{ id: 2, status: 'AC' }], meta: {} } }));
  await act(async () => requests[0].resolve({ data: { data: [{ id: 1, status: 'AC' }], meta: {} } }));
  expect(result.current.submissions[0].id).toBe(2);
});

it('polls pending visible submissions in one request and stops after completion', async () => {
  vi.useFakeTimers();
  Object.defineProperty(document, 'hidden', { configurable: true, value: false });
  axiosClient.get.mockResolvedValueOnce({ data: { data: [
    { id: 1, status: 'Queued', can_poll: true },
    { id: 2, status: 'Judging', can_poll: true },
    { id: 3, status: 'Judging', can_poll: false },
  ], meta: {} } }).mockResolvedValueOnce({ data: { data: [
    { id: 1, status: 'AC' }, { id: 2, status: 'WA', test: 2 },
  ] } });
  const { result } = renderHook(() => useSubmissionList('/submissions'));
  await act(async () => {});
  await act(async () => vi.advanceTimersByTimeAsync(3000));
  expect(axiosClient.get.mock.calls[1][0]).toBe('/submissions/statuses');
  expect(axiosClient.get.mock.calls[1][1].params.ids).toEqual([1, 2]);
  expect(result.current.submissions[1].test).toBe(2);
  await act(async () => vi.advanceTimersByTimeAsync(9000));
  expect(axiosClient.get).toHaveBeenCalledTimes(2);
});

it('allows retry after a failed list request', async () => {
  axiosClient.get.mockRejectedValueOnce(new Error('Offline')).mockResolvedValueOnce({ data: { data: [], meta: {} } });
  const { result } = renderHook(() => useSubmissionList('/submissions'));
  await waitFor(() => expect(result.current.error).toBe(true));
  act(() => result.current.retry());
  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(result.current.error).toBe(false);
});
