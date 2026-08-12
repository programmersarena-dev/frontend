import React, { Suspense } from "react";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Loading from "@/components/core/Loading";

import Login from "@/views/Auth/Login";
import SignUp from "@/views/Auth/SignUp";
import ResetPassword from "@/views/Auth/ResetPassword";
import RequestReset from "@/views/Auth/RequestReset";

import GuestLayout from "@/layouts/GuestLayout";
import UserLayout from "@/layouts/UserLayout";
import AdminLayout from "@/layouts/AdminLayout";

import BlogsView from "@/views/User/BlogsView";
import ProblemView from "@/views/User/ProblemView";
import SubmissionView from "@/views/User/SubmissionView";
import RatingsView from "@/views/User/RatingsView";

import ContestLayout from "@/layouts/ContestLayout";
import ContestsView from "@/views/User/Contest/ContestsView";
import ContestProblemsView from "@/views/User/Contest/ContestProblemsView";
import ContestSubmitView from "@/views/User/Contest/ContestSubmitView";
import ContestStandingsView from "@/views/User/Contest/ContestStandingsView";

import ProblemSetLayout from "@/layouts/ProblemSetLayout";
import ProblemSetProblemsView from "@/views/User/ProblemSet/ProblemSetProblemsView";
import ProblemSetStatusView from "@/views/User/ProblemSet/ProblemSetStatusView";
import ProblemSetStandingsView from "@/views/User/ProblemSet/ProblemSetStandingsView";

import ProfileLayout from "@/layouts/ProfileLayout";
import ProfileView from "@/views/User/Profile/ProfileView";
import ProfileEditView from "@/views/User/Profile/ProfileEditView";
import ProfileRatingsView from "@/views/User/Profile/ProfileRatingsView";
import ProfileSubmissionsView from "@/views/User/Profile/ProfileSubmissionsView";

import EmailVerification from "@/components/core/EmailVerification";
import ResendVerificationEmail from "@/components/core/ResendVerificationEmail";
import NotFound from "@/components/core/NotFound";

import AdminDashboardView from "@/views/Admin/DashboardView";
import AdminFileManagerView from "@/views/Admin/FileManagerView";
import AdminBlogList from "@/views/Admin/Blog/BlogList";
import AdminAddBlog from "@/views/Admin/Blog/AddBlog";
import AdminEditBlog from "@/views/Admin/Blog/EditBlog";

import AdminContestListView from "@/views/Admin/Contest/ContestListView";
import AdminContestCreateView from "@/views/Admin/Contest/ContestCreateView";
import AdminContestEditView from "@/views/Admin/Contest/ContestEditView";

import AdminProblemListView from "@/views/Admin/Problem/ProblemListView";
import AdminProblemCreateView from "@/views/Admin/Problem/ProblemCreateView";
import AdminProblemEditView from "@/views/Admin/Problem/ProblemEditView";

const router = createBrowserRouter([
  {
    path: "admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <AdminDashboardView /> },
      { path: "files", element: <AdminFileManagerView /> },

      { path: "blogs", element: <AdminBlogList /> },
      { path: "blog/add", element: <AdminAddBlog /> },
      { path: "blog/:id/edit", element: <AdminEditBlog /> },

      { path: "contests", element: <AdminContestListView /> },
      { path: "contest/add", element: <AdminContestCreateView /> },
      { path: "contest/:id/edit", element: <AdminContestEditView /> },

      { path: "contest/:id/problems", element: <AdminProblemListView /> },
      { path: "contest/:id/problem/add", element: <AdminProblemCreateView /> },
      { path: "contest/:id/problem/:char", element: <AdminProblemEditView /> },
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
    element: <UserLayout />,
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