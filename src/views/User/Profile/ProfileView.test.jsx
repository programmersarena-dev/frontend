import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, expect, it, vi } from 'vitest';
import axiosClient from '@/api/axios';
import ProfileView from './ProfileView';

vi.mock('@/api/axios', () => ({ default: { get: vi.fn(), post: vi.fn() } }));
vi.mock('@/contexts/AuthContext', () => ({ useAuth: () => ({ currentUser: { handle: 'alice', email_verified_at: null } }) }));
vi.mock('@/contexts/ToastContext', () => ({ useToast: () => ({ addToast: vi.fn() }) }));
vi.mock('@/contexts/TranslationContext', () => ({ useTranslation: () => ({ __: (key) => key }) }));
afterEach(cleanup);
const profile = { data: { data: { name: 'Alice', handle: 'alice', current_rating: 1500, accepted_problems_count: 12 } } };
const renderProfile = () => render(<MemoryRouter initialEntries={['/profile/alice']}><Routes>
  <Route path="/profile/:handle" element={<ProfileView />} />
</Routes></MemoryRouter>);

it('shows a retryable error for network failures and recovers', async () => {
  axiosClient.get.mockRejectedValueOnce(new Error('Offline')).mockResolvedValueOnce(profile);
  renderProfile();
  fireEvent.click(await screen.findByRole('button', { name: 'common.retry' }));
  expect(await screen.findByRole('heading', { name: 'Alice' })).toBeTruthy();
  expect(screen.getByText('1500')).toBeTruthy();
});

it('prevents duplicate verification requests', async () => {
  axiosClient.get.mockResolvedValueOnce(profile);
  let complete;
  axiosClient.post.mockImplementation(() => new Promise((resolve) => { complete = resolve; }));
  renderProfile();
  const button = await screen.findByRole('button', { name: 'user.profile.verify_email' });
  fireEvent.click(button);
  fireEvent.click(button);
  expect(axiosClient.post).toHaveBeenCalledTimes(1);
  await act(async () => complete());
  expect(screen.getByRole('button', { name: 'user.profile.verification_sent' }).disabled).toBe(true);
});
