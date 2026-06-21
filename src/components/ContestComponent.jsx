import React from "react";
import { Outlet, useParams } from "react-router-dom";
import ContestSecondLevelMenu from "./Contest/ContestSecondLevelMenu";

export default function ContestComponent() {
  const { id } = useParams();

  return (
    <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
      <ContestSecondLevelMenu contestId={id} />
      <div className="container mx-auto py-6">

        <Outlet />

      </div>
    </div>
  );
}
