import React from "react";
import { Outlet, useParams } from "react-router-dom";
import ProfileMenu from "./Profile/ProfileMenu";

export default function ProfileComponent() {
  const { username } = useParams();

  return (
    <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
      <ProfileMenu username={username} />
      <div className="container mx-auto py-2">

        <Outlet />

      </div>
    </div>
  );
}
