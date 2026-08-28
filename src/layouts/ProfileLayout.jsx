import React from "react";
import { Outlet, useParams } from "react-router-dom";
import ProfileMenu from "../components/Profile/ProfileMenu";

export default function ProfileLayout() {
  const { username } = useParams();

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <ProfileMenu username={username} />
      <Outlet />
    </div>
  );
}