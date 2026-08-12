import React, { useEffect, useState } from "react";
import axiosClient from "@/api/axios";
import { Link, useParams } from "react-router-dom";
import Loading from "@/components/core/Loading";
import NotFound from "@/components/core/NotFound";
import { UserIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

const Stat = ({ label, children }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
    <span className="text-xs text-slate-400">{label}</span>
    <span className="text-sm font-medium text-slate-800">{children}</span>
  </div>
);

export default function ProfileView() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const { handle } = useParams();
  const { addToast } = useToast();

  useEffect(() => {
    axiosClient
      .get(`/profile/${handle}`)
      .then((res) => {
        setUser(res.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
        setLoading(false);
      });
  }, [handle]);

  const handleResend = () => {
    axiosClient
      .post("/email/resend")
      .then(() => {
        addToast("E-poçta salgyňyza üstünlikli iberildi");
      })
      .catch(() => {
        addToast("Ýalňyşlyk ýüze çykdy");
      });
  };

  if (loading) {
    return <Loading />;
  }

  if (!user.name) {
    return <NotFound />;
  }

  const isOwnProfile = currentUser?.handle === handle;

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <div className="border border-slate-100 rounded-2xl overflow-hidden">
        <div className="px-6 pt-8 pb-6 text-center">
          {user.image ? (
            <img
              className="h-24 w-24 rounded-full object-cover mx-auto"
              src={user.image}
              alt={`${user.name}'s profile`}
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-slate-50 flex items-center justify-center mx-auto">
              <UserIcon className="h-10 w-10 text-slate-300" />
            </div>
          )}

          <h2 className="text-lg font-semibold text-slate-900 mt-4">
            {user.name}
          </h2>

          <div className="flex justify-center items-center gap-1.5 mt-1.5">
            <span
              className={`h-1.5 w-1.5 rounded-full ${user.is_online === 1 ? "bg-emerald-500" : "bg-slate-300"
                }`}
            />
            <span className="text-xs text-slate-400">
              {user.is_online === 1 ? "Onlaýn" : "Oflaýn"}
            </span>
          </div>

          {isOwnProfile && (
            <div className="mt-4">
              {currentUser.email_verified_at !== null ? (
                <Link
                  to={`/profile/${user.handle}/edit`}
                  className="text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors"
                >
                  Profili üýtgetmek
                </Link>
              ) : (
                <button
                  onClick={handleResend}
                  className="text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors"
                >
                  E-poçta salga tassyklama iber
                </button>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 px-6 py-5">
          <div className="text-[10.5px] font-medium text-slate-400 uppercase tracking-wide mb-1.5">
            Profil maglumatlar
          </div>
          <div>
            <Stat label="Ady">{user.first_name || "—"}</Stat>
            <Stat label="Familiýasy">{user.last_name || "—"}</Stat>
            {user.country && <Stat label="Ýurdy">{user.country}</Stat>}
            <Stat label="Reýtingi">
              <span className="font-mono">{user.current_rating || "0"}</span>
            </Stat>
            <Stat label="Işlän mesele sany">
              <span className="font-mono">{user.accepted_problems_count ?? 0}</span>
            </Stat>
          </div>
        </div>
      </div>
    </div>
  );
}