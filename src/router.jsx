import React, { Suspense } from "react";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Loading from "@/components/core/Loading";

import DefaultLayout from "@/components/DefaultLayout";
import Dashboard from "@/views/Dashboard";
import Login from "@/views/Login";
import SignUp from "@/views/SignUp";
import Problem from "@/views/Problem";
import Submission from "@/views/Problemset/Submission";
import Contests from "@/views/Contest/Contests";
import Rating from "@/views/Rating";
import ResetPassword from "@/views/ResetPassword";
import RequestReset from "@/views/RequestReset";

import EmailVerification from "@/components/core/EmailVerification";
import ResendVerificationEmail from "@/components/core/ResendVerificationEmail";
import NotFound from "@/components/core/NotFound";
import PageComponent from "@/components/PageComponent";
import GuestComponent from "@/components/GuestComponent";

import ProfileComponent from "@/components/ProfileComponent";
import Profile from "@/views/Profile/Profile";
import ProfileEdit from "@/views/Profile/ProfileEdit";
import ProfileRatings from "@/views/Profile/ProfileRatings";
import ProfileSubmissions from "@/views/Profile/ProfileSubmissions";

import ProblemsetComponent from "@/components/ProblemsetComponent";
import ProblemsetProblems from "@/views/Problemset/ProblemsetProblems";
import ProblemsetStatus from "@/views/Problemset/ProblemsetStatus";
import ProblemsetStandings from "@/views/Problemset/ProblemsetStandings";

import ContestComponent from "@/components/ContestComponent";
import ContestProblems from "@/views/Contest/ContestProblems";
import ContestSubmit from "@/views/Contest/ContestSubmit";
import ContestStandings from "@/views/Contest/ContestStandings";

import AdminDashboard from "@/views/Admin/Dashboard";
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

const AdminGuard = () => {
  const { currentUser } = useAuth();
  if (!currentUser || currentUser.user_type !== "admin") {
    return <NotFound />;
  }
  return <Outlet />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<Loading />}>
        <DefaultLayout />
      </Suspense>
    ),
    children: [
      {
        path: "admin",
        element: <AdminGuard />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: "dashboard", element: <AdminDashboard /> },
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
        element: <PageComponent />,
        children: [
          { index: true, element: <Navigate to="blogs" replace /> },
          { path: "blogs", element: <Dashboard /> },
          { path: "contests", element: <Contests /> },
          { path: "ratings", element: <Rating /> },

          { path: "email/verify", element: <EmailVerification /> },
          { path: "resend-verification-email", element: <ResendVerificationEmail /> },

          {
            path: "contest/:id",
            element: <ContestComponent />,
            children: [
              { index: true, element: <ContestProblems /> },
              { path: "submit", element: <ContestSubmit /> },
              { path: "standings", element: <ContestStandings /> },
              { path: "problem/:char", element: <Problem /> },
              { path: "problem/:char/submissions", element: <ProblemsetStatus /> },
              { path: "submission/:submissionId", element: <Submission /> },
            ],
          },

          {
            path: "problemset",
            element: <ProblemsetComponent />,
            children: [
              { index: true, element: <ProblemsetProblems /> },
              { path: "problem/:id/:char", element: <Problem /> },
              { path: "status", element: <ProblemsetStatus /> },
              { path: "standings", element: <ProblemsetStandings /> },
              { path: "status/:id/problem/:char", element: <ProblemsetStatus /> },
              { path: "submission/:submissionId", element: <Submission /> },
            ],
          },

          {
            path: "profile",
            element: <ProfileComponent />,
            children: [
              { path: ":username", element: <Profile /> },
              { path: ":username/edit", element: <ProfileEdit /> },
              { path: ":username/submissions", element: <ProfileSubmissions /> },
              { path: ":username/ratings", element: <ProfileRatings /> },
            ],
          },
        ],
      },
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