import React, { useEffect, useState } from "react";
import axiosClient from "@/api/axios";
import Loading from "@/components/core/Loading";
import { CheckCircleIcon, UsersIcon } from "@heroicons/react/24/outline";
import Rechart from "@/components/core/Rechart";
import { useTranslation } from "@/contexts/TranslationContext";

const SummaryCard = ({ icon, title, count }) => (
  <div className="p-6 bg-white rounded-lg shadow-md flex flex-col items-center">
    <div className="flex items-center justify-center mb-4">
      {icon}
      <h2 className="text-xl font-semibold ml-2">{title}</h2>
    </div>
    <span className="text-4xl font-bold text-gray-800">{count}</span>
  </div>
);

const ChartCard = ({ title, data }) => (
  <div className="p-6 bg-white rounded-lg shadow-md">
    <h3 className="text-xl font-semibold mb-4">{title}</h3>
    <Rechart data={data} />
  </div>
);

export default function DashboardView() {
  const { __ } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();

  useEffect(() => {
    axiosClient
      .get("/admin")
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching dashboard data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <Loading />;

  return (
    <>
    {data && (
      <div className="p-8 min-h-screen">
          <h1 className="text-2xl font-bold mb-6">{__("admin.dashboard.title")}</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SummaryCard
            icon={<UsersIcon className="h-8 w-8 text-blue-500" />}
            title={__("admin.dashboard.users")}
            count={data.usersCount}
          />
          <SummaryCard
            icon={<CheckCircleIcon className="h-8 w-8 text-green-500" />}
            title={__("admin.dashboard.contests")}
            count={data.contestsCount}
          />
          <SummaryCard
            icon={<CheckCircleIcon className="h-8 w-8 text-yellow-500" />}
            title={__("admin.dashboard.problems")}
            count={data.problemsCount}
          />
          <SummaryCard
            icon={<CheckCircleIcon className="h-8 w-8 text-red-500" />}
            title={__("admin.dashboard.submissions")}
            count={data.submissionsCount}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title={__("admin.dashboard.charts.users")} data={data.users} />
          <ChartCard title={__("admin.dashboard.charts.contests")} data={data.contests} />
          <ChartCard title={__("admin.dashboard.charts.problems")} data={data.problems} />
          <ChartCard title={__("admin.dashboard.charts.submissions")} data={data.submissions} />
        </div>
      </div>
    )}
    </>
  );
}
