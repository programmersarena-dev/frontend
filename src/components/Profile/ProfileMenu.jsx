import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useParams, Link, useLocation } from "react-router-dom";

const TABS = [
  { path: "", label: "Profil" },
  { path: "/edit", label: "Sazlamalar", ownerOnly: true },
  { path: "/submissions", label: "Iberilen kodlar" },
  { path: "/ratings", label: "Reýting üýtgemeler" },
];

export default function ProfileMenu() {
  const { currentUser } = useAuth();
  const { username } = useParams();
  const { pathname } = useLocation();

  const canEdit = currentUser?.name === username && currentUser?.email_verified_at;

  return (
    <div className="mb-6">
      <h2 className="text-sm font-semibold text-slate-900 mb-3">{username}</h2>
      <nav className="flex gap-5 border-b border-slate-100">
        {TABS.filter((tab) => !tab.ownerOnly || canEdit).map((tab) => {
          const to = `/profile/${username}${tab.path}`;
          const isActive = pathname === to;
          return (
            <Link
              key={tab.path}
              to={to}
              className={`relative pb-2.5 text-xs font-medium transition-colors ${
                isActive
                  ? "text-indigo-600"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.label}
              {isActive && (
                <span className="absolute left-0 right-0 -bottom-px h-[1.5px] bg-indigo-600" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}