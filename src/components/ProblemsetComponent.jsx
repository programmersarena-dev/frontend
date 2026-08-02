import ProblemsetSecondLevelMenu from "./Problemset/ProblemsetSecondLevelMenu";
import { Outlet } from "react-router-dom";

export default function ProblemsetComponent() {

  return (
    <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
      <ProblemsetSecondLevelMenu />
      <div className="container mx-auto py-6">

        <Outlet />

      </div>
    </div>
  );
}
