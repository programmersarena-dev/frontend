import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { useTranslation } from '@/contexts/TranslationContext';
import { CheckIcon, ChevronDoubleRightIcon, XMarkIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import axiosClient from "@/api/axios";

export default function UserContestRegisterButton({ contest, setContest }) {
  const { user } = useAuth();
  const { addToast } = useToast();
  const { __ } = useTranslation();
  const navigate = useNavigate();

  const [opponent, setOpponent] = useState('');
  const [isRegistered, setIsRegistered] = useState(contest.is_registered);
  const [currentDuo, setCurrentDuo] = useState(null);
  const [loading, setLoading] = useState(false);

  const register = () => {
    if (window.confirm("Siz çyndanam bäsleşige ýazylmakçymy?")) {
      if (!user.name) return addToast("error", "Hasabyňyza giriň");
      if (!user.email_verified_at) return addToast("error", "Poçtaňyzy tassyklaň");

      setLoading(true);
      const data = new FormData();
      if (contest.type === 'Duel') {
        data.append('opponent', opponent === '' ? currentDuo[1] : opponent);
      }

      axiosClient
        .post(`/contest/${contest.id}/register`, data)
        .then(() => {
          addToast("success", "Bäsleşige üstünlikli ýazyldyňyz");
          setIsRegistered(true);
          if (contest.type === 'Duel') setCurrentDuo([user.name, opponent === '' ? currentDuo[1] : opponent + '|X']);
          navigate("/contests");
        })
        .catch((error) => {
          addToast("error", error.response?.data?.message || "Error");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const unregister = () => {
    if (window.confirm("Siz çyndanam bäsleşikden çykmakçymy?")) {
      if (!user.name) return addToast("error", "Hasabyňyza giriň");
      if (!user.email_verified_at) return addToast("error", "Poçtaňyzy tassyklaň");

      setLoading(true);
      axiosClient
        .post(`/contest/${contest.id}/unregister`)
        .then(() => {
          addToast("success", "Bäsleşikden üstünlikli çykdyňyz");
          setIsRegistered(false);
          if (contest.type === 'Duel') setCurrentDuo(null);
          navigate("/contests");
        })
        .catch((error) => {
          addToast("error", error.response?.data?.message || "Error");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    if (contest.is_registered && contest.type === 'Duel') {
      let duel =
        contest.participants?.official?.find(
          (duel) =>
            Array.isArray(duel) &&
            (duel.includes(user.name) || duel.includes(user.name + '|X'))
        ) ||
        contest.participants?.unofficial?.find(
          (duel) =>
            Array.isArray(duel) &&
            (duel.includes(user.name) || duel.includes(user.name + '|X'))
        ) ||
        null;

      if (duel) {
        if (duel[1]?.split('|')[0] === user.name) {
          [duel[0], duel[1]] = [duel[1], duel[0]];
        }

        if (duel[0]?.endsWith('|X')) {
          setIsRegistered(false);
        }
        setCurrentDuo(duel);
      }
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-xs mx-auto">
      {isRegistered ? (
        <div className="w-full space-y-3 text-center">
          {currentDuo && (
            <div className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-medium text-slate-300">
              <span className="text-slate-100">{currentDuo[0]}</span>
              <span className="text-indigo-400 font-semibold">vs</span>
              {currentDuo[1].endsWith('|X') ? (
                <div className="flex items-center gap-1 bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded-lg border border-rose-500/20">
                  <span>{currentDuo[1].split('|')[0]}</span>
                  <XMarkIcon className="w-3.5 h-3.5" />
                </div>
              ) : (
                <span className="text-slate-100">{currentDuo[1]}</span>
              )}
            </div>
          )}
          <button
            disabled={loading}
            onClick={unregister}
            className="w-full flex justify-center items-center py-2 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-rose-600 hover:bg-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-500/40 active:bg-rose-700 transition duration-200 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            <span>{__("contest.quit") || "Quit"}</span>
            <ChevronDoubleRightIcon className="w-4 h-4 ml-1.5" />
          </button>
        </div>
      ) : (
        <div className="w-full space-y-3">
          {contest.type === "Duel" && !currentDuo && (
            <div className="relative rounded-xl shadow-sm w-full">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <UserPlusIcon className="h-4 w-4 text-slate-500" aria-hidden="true" />
              </div>
              <input
                name="opponent"
                value={opponent}
                disabled={loading}
                onChange={(e) => setOpponent(e.target.value)}
                type="text"
                placeholder="Type Username"
                className="block w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder-slate-600 text-slate-200 rounded-xl focus:outline-none focus:ring-4 text-sm transition duration-200 disabled:opacity-50"
              />
            </div>
          )}

          {contest.type === "Duel" && currentDuo ? (
            <div className="flex flex-col items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-2xl w-full">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                <span className="text-slate-100">{currentDuo[0]?.split('|')[0]}</span>
                <span className="text-indigo-400 font-semibold">vs</span>
                <span className="text-slate-100">{currentDuo[1]?.split('|')[0]}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 w-full">
                <button
                  disabled={loading}
                  onClick={register}
                  className="flex items-center justify-center gap-1.5 bg-indigo-600 text-white px-3 py-2 border border-transparent text-xs font-semibold rounded-xl hover:bg-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/40 transition duration-200 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  <CheckIcon className="w-3.5 h-3.5" />
                  <span>Confirm</span>
                </button>
                <button
                  disabled={loading}
                  onClick={unregister}
                  className="flex items-center justify-center gap-1.5 bg-slate-900 text-slate-300 px-3 py-2 border border-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-700/40 transition duration-200 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  <XMarkIcon className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          ) : (
            <button
              disabled={loading}
              onClick={register}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/40 active:bg-indigo-700 transition duration-200 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              <span>{__("contest.register") || "Register"}</span>
              <ChevronDoubleRightIcon className="w-4 h-4 ml-1.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}