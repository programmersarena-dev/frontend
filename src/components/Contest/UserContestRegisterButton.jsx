import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '@/contexts/ContextProvider';
import { CheckIcon, ChevronDoubleRightIcon, XMarkIcon } from '@heroicons/react/24/outline';
import axiosClient from '../../axios';

export default function UserContestRegisterButton({ contest, setContest }) {
  const { t, showToast, currentUser } = useStateContext();
  const navigate = useNavigate();
  const [opponent, setOpponent] = useState('');
  const [isRegistered, setIsRegistered] = useState(contest.is_registered);
  const [currentDuo, setCurrentDuo] = useState(null);

  const register = () => {
    if (window.confirm("Siz çyndanam bäsleşige ýazylmakçymy?")) {
      if (!currentUser.name) return showToast("Hasabyňyza giriň");
      if (!currentUser.email_verified_at) return showToast("Poçtaňyzy tassyklaň");

      const data = new FormData();
      if (contest.type === 'Duel') {
        data.append('opponent', opponent === '' ? currentDuo[1] : opponent);
      }

      axiosClient
        .post(`/contest/${contest.id}/register`, data)
        .then(() => {
          showToast("Bäsleşige üstünlikli ýazyldyňyz");
          setIsRegistered(true);
          if (contest.type === 'Duel') setCurrentDuo([currentUser.name, opponent === '' ? currentDuo[1] : opponent + '|X']);
          navigate("/contests");
        })
        .catch((error) => {
          showToast(error.response?.data?.message || "Error");
        });
    }
  };

  const unregister = () => {
    if (window.confirm("Siz çyndanam bäsleşikden çykmakçymy?")) {
      if (!currentUser.name) return showToast("Hasabyňyza giriň");
      if (!currentUser.email_verified_at) return showToast("Poçtaňyzy tassyklaň");

      axiosClient
        .post(`/contest/${contest.id}/unregister`)
        .then(() => {
          showToast("Bäsleşikden üstünlikli çykdyňyz");
          setIsRegistered(false);
          if (contest.type === 'Duel') setCurrentDuo(null);
          navigate("/contests");
        })
        .catch((error) => {
          showToast(error.response?.data?.message || "Error");
        });
    }
  };

  useEffect(() => {
    if (contest.is_registered && contest.type === 'Duel') {
      let duel =
        contest.participants?.official?.find(
          (duel) =>
            Array.isArray(duel) &&
            (duel.includes(currentUser.name) || duel.includes(currentUser.name + '|X'))
        ) ||
        contest.participants?.unofficial?.find(
          (duel) =>
            Array.isArray(duel) &&
            (duel.includes(currentUser.name) || duel.includes(currentUser.name + '|X'))
        ) ||
        null;

      if (duel) {
        if (duel[1]?.split('|')[0] === currentUser.name) {
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
    <div className="flex flex-col items-center">
      {isRegistered ? (
        <>
          {currentDuo && (
            <div className="flex gap-2 mb-2 text-xs text-gray-700">
              <span>{currentDuo[0]}</span>
              <span>x</span>
              {currentDuo[1].endsWith('|X') ? (
                <>
                  <span>{currentDuo[1].split('|')[0]}</span>
                  <XMarkIcon className='w-4 h-4 text-red-500' />
                  <span>needs to verify!</span>
                </>
              ) : (<span>{currentDuo[1]}</span>)}
            </div>
          )}
          <button
            className="flex items-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 mb-1"
            onClick={unregister}
          >
            <span>{t("contest.quit")}</span>
            <ChevronDoubleRightIcon className="w-4 h-4 ml-1" />
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center gap-2 mb-1">
          {contest.type === "Duel" && !currentDuo && (
            <input
              name="opponent"
              value={opponent}
              onChange={(e) => setOpponent(e.target.value)}
              type="text"
              placeholder="Type Username"
              className="border border-gray-300 rounded px-3 py-2 w-32 text-xs focus:outline-none focus:ring-2 focus:ring-green-500 flex-1"
            />
          )}

          {contest.type === "Duel" && currentDuo ? (
            <div className="flex items-center gap-2 mb-2 text-xs text-gray-700">
              <span>{currentDuo[0]?.split('|')[0]}</span>
              <span>x</span>
              <span>{currentDuo[1]?.split('|')[0]}</span>
              <button
                onClick={register}
                className="flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <CheckIcon className="w-3 h-3" />
                <span>Confirm</span>
              </button>
              <button
                onClick={unregister}
                className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <CheckIcon className="w-3 h-3" />
                <span>Cancel</span>
              </button>
            </div>
          ) : (
            <button
              onClick={register}
              className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <span>{t("contest.register")}</span>
              <ChevronDoubleRightIcon className="w-4 h-4 ml-1" />
            </button>
          )}
        </div>
      )
      }
    </div >
  );
}
