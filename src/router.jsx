import { Suspense, lazy } from "react";
import PropTypes from 'prop-types';
import { createBrowserRouter, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Loading from "@/components/core/Loading";
import GuestLayout from "@/layouts/GuestLayout";
import UserLayout from "@/layouts/UserLayout";
import AdminLayout from "@/layouts/AdminLayout";
import ContestLayout from "@/layouts/ContestLayout";

import ProblemSetLayout from "@/layouts/ProblemSetLayout";

import ProfileLayout from "@/layouts/ProfileLayout";

import EmailVerification from "@/components/core/EmailVerification";
import ResendVerificationEmail from "@/components/core/ResendVerificationEmail";
import NotFound from "@/components/core/NotFound";
import { getStoredToken } from "@/api/axios";

function lazyView(loader) {
  const Component = lazy(loader);
  return function LazyView(props) {
    return <Suspense fallback={<Loading />}><Component {...props} /></Suspense>;
  };
}

const Login = lazyView(() => import("@/views/Auth/Login"));
const SignUp = lazyView(() => import("@/views/Auth/SignUp"));
const ResetPassword = lazyView(() => import("@/views/Auth/ResetPassword"));
const RequestReset = lazyView(() => import("@/views/Auth/RequestReset"));
const BlogsView = lazyView(() => import("@/views/User/BlogsView"));
const ProblemView = lazyView(() => import("@/views/User/ProblemView"));
const SubmissionView = lazyView(() => import("@/views/User/SubmissionView"));
const RatingsView = lazyView(() => import("@/views/User/RatingsView"));
const ContestsView = lazyView(() => import("@/views/User/Contest/ContestsView"));
const ContestProblemsView = lazyView(() => import("@/views/User/Contest/ContestProblemsView"));
const ContestSubmitView = lazyView(() => import("@/views/User/Contest/ContestSubmitView"));
const ContestStandingsView = lazyView(() => import("@/views/User/Contest/ContestStandingsView"));
const ProblemSetProblemsView = lazyView(() => import("@/views/User/ProblemSet/ProblemSetProblemsView"));
const ProblemSetStatusView = lazyView(() => import("@/views/User/ProblemSet/ProblemSetStatusView"));
const ProblemSetStandingsView = lazyView(() => import("@/views/User/ProblemSet/ProblemSetStandingsView"));
const ProfileView = lazyView(() => import("@/views/User/Profile/ProfileView"));
const ProfileEditView = lazyView(() => import("@/views/User/Profile/ProfileEditView"));
const ProfileRatingsView = lazyView(() => import("@/views/User/Profile/ProfileRatingsView"));
const ProfileSubmissionsView = lazyView(() => import("@/views/User/Profile/ProfileSubmissionsView"));
const ProfileTeamsView = lazyView(() => import("@/views/User/Profile/ProfileTeamsView"));
const AdminDashboardView = lazyView(() => import("@/views/Admin/DashboardView"));
const AdminFileManagerView = lazyView(() => import("@/views/Admin/FileManagerView"));
const AdminBlogList = lazyView(() => import("@/views/Admin/Blog/BlogList"));
const AdminAddBlog = lazyView(() => import("@/views/Admin/Blog/AddBlog"));
const AdminEditBlog = lazyView(() => import("@/views/Admin/Blog/EditBlog"));
const AdminContestListView = lazyView(() => import("@/views/Admin/Contest/ContestListView"));
const AdminContestCreateView = lazyView(() => import("@/views/Admin/Contest/ContestCreateView"));
const AdminContestEditView = lazyView(() => import("@/views/Admin/Contest/ContestEditView"));
const AdminProblemListView = lazyView(() => import("@/views/Admin/Problem/ProblemListView"));
const AdminProblemCreateView = lazyView(() => import("@/views/Admin/Problem/ProblemCreateView"));
const AdminProblemEditView = lazyView(() => import("@/views/Admin/Problem/ProblemEditView"));

// Route guards are intentionally kept next to their route configuration.
// eslint-disable-next-line react-refresh/only-export-components
function ProtectedRoute({ children }) {
  const { loading } = useAuth();
  const token = getStoredToken();

  if (loading) return <Loading />;
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

// eslint-disable-next-line react-refresh/only-export-components
function AdminRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) return <Loading />;
  if (!currentUser || currentUser.user_type !== "admin") return <NotFound />;
  return children;
}

ProtectedRoute.propTypes = { children: PropTypes.node.isRequired };
AdminRoute.propTypes = { children: PropTypes.node.isRequired };

const router = createBrowserRouter([
  {
    path: "admin",
    element: <ProtectedRoute><AdminLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <AdminRoute><AdminDashboardView /></AdminRoute> },
      { path: "files", element: <AdminRoute><AdminFileManagerView /></AdminRoute> },
      { path: "blogs", element: <AdminRoute><AdminBlogList /></AdminRoute> },
      { path: "blog/add", element: <AdminRoute><AdminAddBlog /></AdminRoute> },
      { path: "blog/:id/edit", element: <AdminRoute><AdminEditBlog /></AdminRoute> },
      { path: "contests", element: <AdminRoute><AdminContestListView /></AdminRoute> },
      { path: "contest/add", element: <AdminRoute><AdminContestCreateView /></AdminRoute> },
      { path: "contest/:id/edit", element: <AdminRoute><AdminContestEditView /></AdminRoute> },
      { path: "contest/:id/problems", element: <AdminRoute><AdminProblemListView /></AdminRoute> },
      { path: "contest/:id/problem/add", element: <AdminRoute><AdminProblemCreateView /></AdminRoute> },
      { path: "contest/:id/problem/:char", element: <AdminRoute><AdminProblemEditView /></AdminRoute> },
    ],
  },

  {
    element: <GuestLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "sign-up", element: <SignUp /> },
      { path: "request-reset", element: <RequestReset /> },
      { path: "reset-password", element: <ResetPassword /> },
    ],
  },

  {
    element: <ProtectedRoute><UserLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <Navigate to="blogs" replace /> },
      { path: "blogs", element: <BlogsView /> },
      { path: "ratings", element: <RatingsView /> },
      { path: "contests", element: <ContestsView /> },
      {
        path: "contest/:id",
        element: <ContestLayout />,
        children: [
          { index: true, element: <ContestProblemsView /> },
          { path: "submit", element: <ContestSubmitView /> },
          { path: "standings", element: <ContestStandingsView /> },
          { path: "problem/:char", element: <ProblemView /> },
          { path: "problem/:char/submissions", element: <ProblemSetStatusView /> },
          { path: "submission/:submissionId", element: <SubmissionView /> },
        ],
      },

      {
        path: "problemset",
        element: <ProblemSetLayout />,
        children: [
          { index: true, element: <ProblemSetProblemsView /> },
          { path: "status", element: <ProblemSetStatusView /> },
          { path: "status/:id/problem/:char", element: <ProblemSetStatusView /> },
          { path: "standings", element: <ProblemSetStandingsView /> },
          { path: "problem/:id/:char", element: <ProblemView /> },
          { path: "submission/:submissionId", element: <SubmissionView /> },
        ],
      },

      {
        path: "profile",
        element: <ProfileLayout />,
        children: [
          { path: ":handle", element: <ProfileView /> },
          { path: ":handle/edit", element: <ProfileEditView /> },
          { path: ":handle/teams", element: <ProfileTeamsView /> },
          { path: ":handle/submissions", element: <ProfileSubmissionsView /> },
          { path: ":handle/ratings", element: <ProfileRatingsView /> },
        ],
      },

      { path: "email/verify", element: <EmailVerification /> },
      { path: "resend-verification-email", element: <ResendVerificationEmail /> },
    ],
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<Loading />}>
        <NotFound />
      </Suspense>
    ),
  },
]);

export default router;
