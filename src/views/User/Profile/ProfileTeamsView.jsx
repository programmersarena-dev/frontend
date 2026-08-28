import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "@/api/axios";
import Loading from "@/components/core/Loading";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/contexts/TranslationContext";
import { CheckIcon, XMarkIcon, UserPlusIcon } from "@heroicons/react/24/outline";

export default function ProfileTeamsView() {
  const { handle } = useParams();
  const { currentUser } = useAuth();
  const { __ } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [ownedTeams, setOwnedTeams] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [pendingInvitations, setPendingInvitations] = useState([]);
  const [newTeamName, setNewTeamName] = useState("");
  const [inviteUserHandle, setInviteUserHandle] = useState("");
  const [activeTeamId, setActiveTeamId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const isOwnProfile = currentUser?.handle === handle;

  const fetchData = () => {
    setLoading(true);
    axiosClient.get("/teams").then((res) => {
      setOwnedTeams(res.data.owned_teams || []);
      setMemberships(res.data.memberships || []);
      setPendingInvitations(res.data.pending_invitations || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    if (isOwnProfile) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [currentUser, isOwnProfile]);

  const createTeam = () => {
    if (!newTeamName.trim()) return;
    setActionLoading(true);
    axiosClient.post("/teams", { name: newTeamName }).then((res) => {
      setOwnedTeams([...ownedTeams, res.data.team]);
      setNewTeamName("");
    }).catch(() => { }).finally(() => setActionLoading(false));
  };

  const inviteUser = (teamId) => {
    if (!inviteUserHandle.trim()) return;
    setActionLoading(true);
    axiosClient.post(`/teams/${teamId}/invite`, { handle: inviteUserHandle.trim() }).then(() => {
      setInviteUserHandle("");
      setActiveTeamId(null);
      fetchData();
    }).catch(() => { }).finally(() => setActionLoading(false));
  };

  const acceptInvitation = (teamId) => {
    setActionLoading(true);
    axiosClient.post(`/teams/${teamId}/accept`).then(() => {
      fetchData();
    }).catch(() => { }).finally(() => setActionLoading(false));
  };

  const declineInvitation = (teamId) => {
    setActionLoading(true);
    axiosClient.post(`/teams/${teamId}/decline`).then(() => {
      fetchData();
    }).catch(() => { }).finally(() => setActionLoading(false));
  };

  const removeMember = (teamId, memberId) => {
    setActionLoading(true);
    axiosClient.delete(`/teams/${teamId}/members/${memberId}`).then(() => {
      fetchData();
    }).catch(() => { }).finally(() => setActionLoading(false));
  };

  const deleteTeam = (teamId) => {
    if (!window.confirm(__("contest.quit") || "Are you sure?")) return;
    setActionLoading(true);
    axiosClient.delete(`/teams/${teamId}`).then(() => {
      fetchData();
    }).catch(() => { }).finally(() => setActionLoading(false));
  };

  if (loading) return <Loading />;

  if (!isOwnProfile) {
    return (
      <div className="py-10 text-center text-sm text-slate-400">
        {__("profile.not-found") || "Profile not found"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {pendingInvitations.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-900">
            {__("contest.invitations") || "Invitations"}
          </h3>
          {pendingInvitations.map((team) => (
            <div key={team.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <div className="text-sm font-medium text-slate-900">{team.name}</div>
                <div className="text-xs text-slate-500">
                  {team.owner?.name} ({team.owner?.handle})
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  disabled={actionLoading}
                  onClick={() => acceptInvitation(team.id)}
                  className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 disabled:opacity-50"
                >
                  <CheckIcon className="w-4 h-4" />
                </button>
                <button
                  disabled={actionLoading}
                  onClick={() => declineInvitation(team.id)}
                  className="p-2 bg-rose-600 text-white rounded-lg hover:bg-rose-500 disabled:opacity-50"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-900">
          {__("contest.my-teams") || "My Teams"}
        </h3>

        <div className="flex gap-2">
          <input
            type="text"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            placeholder={__("contest.team-name") || "Team name"}
            className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500/30 focus:border-indigo-500"
          />
          <button
            disabled={actionLoading || !newTeamName.trim()}
            onClick={createTeam}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-500 disabled:opacity-50"
          >
            {__("contest.create") || "Create"}
          </button>
        </div>

        {ownedTeams.length === 0 && (
          <div className="text-xs text-slate-400 py-4 text-center">
            {__("contest.no-teams") || "No teams yet"}
          </div>
        )}

        {ownedTeams.map((team) => (
          <div key={team.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-900">{team.name}</div>
                <div className="text-xs text-slate-500">
                  {team.members?.length || 0}/4 {__("contest.members") || "members"}
                </div>
              </div>
              <button
                disabled={actionLoading}
                onClick={() => deleteTeam(team.id)}
                className="text-xs text-rose-600 hover:text-rose-500"
              >
                {__("contest.delete") || "Delete"}
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {team.members?.map((member) => (
                <div key={member.id} className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-full border border-slate-200">
                  <span className="text-xs text-slate-700">{member.name}</span>
                  {member.status !== "accepted" && (
                    <span className="text-[10px] text-amber-600">({member.status})</span>
                  )}
                  {team.role === "owner" && member.status === "accepted" && member.id !== currentUser?.id && (
                    <button
                      disabled={actionLoading}
                      onClick={() => removeMember(team.id, member.id)}
                      className="text-slate-400 hover:text-rose-500"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {(team.members?.length || 0) < 4 && activeTeamId !== team.id && (
              <button
                onClick={() => setActiveTeamId(team.id)}
                className="text-xs text-indigo-600 hover:text-indigo-500 flex items-center gap-1"
              >
                <UserPlusIcon className="w-3.5 h-3.5" />
                {__("contest.add-member") || "Add member"}
              </button>
            )}

            {activeTeamId === team.id && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inviteUserHandle}
                  onChange={(e) => setInviteUserHandle(e.target.value)}
                  placeholder={__("contest.handle") || "User handle"}
                  className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
                />
                <button
                  disabled={actionLoading || !inviteUserHandle.trim()}
                  onClick={() => inviteUser(team.id)}
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-500 disabled:opacity-50"
                >
                  {__("contest.send") || "Send"}
                </button>
                <button
                  onClick={() => { setActiveTeamId(null); setInviteUserHandle(""); }}
                  className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-300"
                >
                  {__("contest.cancel") || "Cancel"}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {memberships.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-900">
            {__("contest.members") || "My Teams"}
          </h3>
          {memberships.map((team) => (
            <div key={team.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-sm font-medium text-slate-900">{team.name}</div>
              <div className="text-xs text-slate-500">
                Owner: {team.owner?.name} ({team.owner?.handle})
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
