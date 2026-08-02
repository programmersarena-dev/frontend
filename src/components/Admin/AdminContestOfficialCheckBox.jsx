import { XMarkIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react'

export default function AdminContestOfficialCheckBox({ contest, setContest, users, handleInputChange }) {
  const [tempUser1, setTempUser1] = useState(0);
  const [tempUser2, setTempUser2] = useState(0);

  const addParticipant = (participantName) => {
    if (
      participantName &&
      !contest.participants.official.includes(participantName)
    ) {
      setContest({
        ...contest,
        participants: {
          ...contest.participants,
          official: [
            ...contest.participants.official,
            participantName,
          ],
        },
      });
    }
  };

  const isUserRegistered = (name) => {
    const isUserRegisteredOfficial = contest.participants.official.some(
      duo => duo[0] === name || duo[1] === name
    );

    const isUserRegisteredUnOfficial = contest.participants.unofficial.some(
      duo => duo[0] === name || duo[1] === name
    );

    if (
      isUserRegisteredOfficial ||
      isUserRegisteredUnOfficial
    ) {
      return true;
    }
    return false;
  }

  const addParticipantsInDuelMode = () => {
    if (isUserRegistered(tempUser1) || isUserRegistered(tempUser2)) {
      console.log('User is already registered');
      return;
    }

    if (tempUser1 && tempUser2 && tempUser1 !== tempUser2) {
      setContest({
        ...contest,
        participants: {
          ...contest.participants,
          official: [
            ...contest.participants.official,
            [tempUser1, tempUser2],
          ],
        },
      });
    }
  };

  const removeParticipant = (participantName) => {
    setContest({
      ...contest,
      participants: {
        ...contest.participants,
        official: contest.participants.official.filter(
          (name) => name !== participantName
        ),
      },
    });
  };

  const removeDuel = (user1Name, user2Name) => {
    setContest({
      ...contest,
      participants: {
        ...contest.participants,
        official: contest.participants.official.filter(
          duo => !(duo[0] === user1Name && duo[1] === user2Name)
        ),
      },
    });
  };

  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Resmi:
        </label>
        <input
          type="checkbox"
          name="official"
          checked={contest.official}
          onChange={handleInputChange}
          className="mt-1 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        />
      </div>
      {contest.official === true && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Resmi gatnaşyjylar:
          </label>
          <div className="mt-1 flex flex-wrap gap-2">
            {contest.type === 'Classic' ? (
              contest?.participants?.official?.length > 0 && contest.participants.official.map((participantName) => {
                const participant = users.find(
                  (user) => user.name === participantName
                );
                return (
                  participant && (
                    <span
                      key={participantName}
                      className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm cursor-pointer flex items-center gap-1"
                      onClick={() => removeParticipant(participantName)}
                    >
                      {participant.name} <XMarkIcon className="h-4 w-4" />
                    </span>
                  )
                );
              })
            ) : (
              contest?.participants?.official?.length > 0 && contest.participants.official.map((duo, index) => {
                const participant1 = users.find((user) => user.name === duo[0]);
                const participant2 = users.find((user) => user.name === duo[1]);

                return (
                  <button
                    key={index}
                    className="flex items-center gap-1 bg-gray-200 rounded-full"
                    onClick={() => removeDuel(duo[0], duo[1])}
                  >
                    {participant1 && (
                      <span className="text-gray-800 px-3 py-1 text-sm cursor-pointer flex items-center gap-1">
                        {participant1.name}
                      </span>
                    )}
                    <span className="text-gray-500">x</span>
                    {participant2 && (
                      <span className="text-gray-800 px-3 py-1 text-sm cursor-pointer flex items-center gap-1">
                        {participant2.name}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
          <div className="mt-2">
            {contest.type === 'Classic' ? (
              <select
                onChange={(e) => addParticipant(e.target.value)}
                className="block w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Resmi gatnaşyjylary saýla</option>
                {users.map((user) => (
                  <option key={user.id} value={user.name}>
                    {user.name} - {user.email}
                  </option>
                ))}
              </select>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <select
                    value={tempUser1}
                    onChange={(e) => setTempUser1(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  >
                    <option value="">Select Player 1</option>
                    {users.map((user) => (
                      <option
                        key={user.id}
                        value={user.name}
                        disabled={user.id === parseInt(tempUser2, 10)}
                      >
                        {user.name} - {user.email}
                      </option>
                    ))}
                  </select>

                  <select
                    value={tempUser2}
                    onChange={(e) => setTempUser2(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  >
                    <option value="">Select Player 2</option>
                    {users.map((user) => (
                      <option
                        key={user.id}
                        value={user.name}
                        disabled={user.id === parseInt(tempUser1, 10)}
                      >
                        {user.name} - {user.email}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={addParticipantsInDuelMode}
                  className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Add Players
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
