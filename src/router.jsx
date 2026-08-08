import React, { Suspense } from "react";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Loading from "@/components/core/Loading";

import Login from "@/views/Auth/Login";
import SignUp from "@/views/Auth/SignUp";
import ResetPassword from "@/views/Auth/ResetPassword";
import RequestReset from "@/views/Auth/RequestReset";

import UserLayout from "@/layouts/UserLayout";

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
import GuestComponent from "@/components/GuestComponent";

import AdminLayout from "@/layouts/AdminLayout";

import AdminDashboardView from "@/views/Admin/DashboardView";
import FileManager from "@/views/Admin/FileManager";
import AdminBlogList from "@/views/Admin/Blog/BlogList";
import AdminAddBlog from "@/views/Admin/Blog/AddBlog";
import AdminEditBlog from "@/views/Admin/Blog/EditBlog";
import AdminContestList from "@/views/Admin/Contest/ContestList";
import AdminAddContest from "@/views/Admin/Contest/AddContest";
import AdminEditContest from "@/views/Admin/Contest/EditContest";
import AdminProblemList from "@/views/Admin/Problem/ProblemList";
import AdminAddProblem from "@/views/Admin/Problem/AddProblem";
import AdminEditProblem from "@/views/Admin/Problem/EditProblem";

const GuestGuard = () => {
  const { currentUser } = useAuth();
  return currentUser ? <Navigate to="/" replace /> : <Outlet />;
};

const router = createBrowserRouter([
  {
    path: "admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <AdminDashboardView /> },
      { path: "files", element: <FileManager /> },

      { path: "blogs", element: <AdminBlogList /> },
      { path: "blog/add", element: <AdminAddBlog /> },
      { path: "blog/:id/edit", element: <AdminEditBlog /> },

      { path: "contests", element: <AdminContestList /> },
      { path: "contest/add", element: <AdminAddContest /> },
      { path: "contest/:id/edit", element: <AdminEditContest /> },
      { path: "contest/:id/problems", element: <AdminProblemList /> },
      { path: "contest/:id/problem/add", element: <AdminAddProblem /> },
      { path: "contest/:id/problem/:char", element: <AdminEditProblem /> },
    ],
  },

  {
    element: <GuestGuard />,
    children: [
      {
        element: <GuestComponent />,
        children: [
          { path: "login", element: <Login /> },
          { path: "sign-up", element: <SignUp /> },
          { path: "request-reset", element: <RequestReset /> },
          { path: "reset-password", element: <ResetPassword /> },
        ],
      },
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
          { path: ":username", element: <ProfileView /> },
          { path: ":username/edit", element: <ProfileEditView /> },
          { path: ":username/submissions", element: <ProfileSubmissionsView /> },
          { path: ":username/ratings", element: <ProfileRatingsView /> },
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