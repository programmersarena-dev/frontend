import { XMarkIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react'
import { useTranslation } from "@/contexts/TranslationContext";

export default function AdminContestOfficialCheckBox({ contest, setContest, users, handleInputChange }) {
  const { __ } = useTranslation();
  const [tempUser1, setTempUser1] = useState(0);
  const [tempUser2, setTempUser2] = useState(0);
  const [tempICPCUsers, setTempICPCUsers] = useState([]);

  const normalizeICPCParticipants = (participants) => {
    if (!participants || !Array.isArray(participants.official)) return participants;
    const official = participants.official;
    if (official.length === 0) return participants;
    if (official.every(item => Array.isArray(item))) return participants;
    const groups = [];
    for (let i = 0; i < official.length; i += 4) {
      groups.push(official.slice(i, i + 4));
    }
    return {
      ...participants,
      official: groups,
    };
  };

  useEffect(() => {
    if (contest.type === 'ICPC') {
      const normalized = normalizeICPCParticipants(contest.participants);
      if (JSON.stringify(normalized.participants) !== JSON.stringify(contest.participants)) {
        setContest({ ...contest, participants: normalized.participants });
      }
    }
  }, []);

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
    const officialList = contest.participants?.official || [];
    const unofficialList = contest.participants?.unofficial || [];
    const isUserRegisteredOfficial = officialList.some(
      item => Array.isArray(item) ? item.includes(name) : item === name
    );
    const isUserRegisteredUnOfficial = unofficialList.some(
      item => Array.isArray(item) ? item.includes(name) : item === name
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
          name => name !== participantName && (!Array.isArray(name) || !name.includes(participantName))
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
          duo => !(Array.isArray(duo) && duo[0] === user1Name && duo[1] === user2Name)
        ),
      },
    });
  };

  const addICPCUser = (userName) => {
    if (!userName || isUserRegistered(userName)) return;
    if (tempICPCUsers.length >= 4) return;

    setTempICPCUsers([...tempICPCUsers, userName]);
  };

  const removeICPCUser = (userName) => {
    setTempICPCUsers(tempICPCUsers.filter(name => name !== userName));
  };

  const submitICPCGroup = () => {
    if (tempICPCUsers.length !== 4) return;

    setContest({
      ...contest,
      participants: {
        ...contest.participants,
        official: [...(contest.participants.official || []), [...tempICPCUsers]],
      },
    });
    setTempICPCUsers([]);
  };

  const isICPC = contest.type === 'ICPC';

  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          {__("admin.contest.official-label")}
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
            {isICPC ? __("admin.contest.official-teams") : __("admin.contest.official-participants")}
          </label>
          <div className="mt-1 flex flex-wrap gap-2">
            {isICPC ? (
              (Array.isArray(contest?.participants?.official) && contest.participants.official.length > 0)
                ? contest.participants.official.map((group, groupIndex) => (
                    <div key={groupIndex} className="flex items-center gap-1 bg-gray-200 rounded-full">
                      {(Array.isArray(group) ? group : [group]).map((memberName) => {
                        const member = users.find((user) => user.name === memberName);
                        return (
                          <span
                            key={memberName}
                            className="text-gray-800 px-3 py-1 text-sm cursor-pointer flex items-center gap-1"
                            onClick={() => {
                              if (Array.isArray(group)) {
                                const updatedGroup = group.filter(name => name !== memberName);
                                const newOfficial = [...contest.participants.official];
                                newOfficial[groupIndex] = updatedGroup;
                                setContest({
                                  ...contest,
                                  participants: {
                                    ...contest.participants,
                                    official: newOfficial,
                                  },
                                });
                              } else {
                                removeParticipant(memberName);
                              }
                            }}
                          >
                            {member?.name || memberName}
                          </span>
                        );
                      })}
                    </div>
                  ))
                : null
            ) : contest.type === 'Classic' ? (
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
            {isICPC ? (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {tempICPCUsers.map((name) => {
                    const user = users.find((u) => u.name === name);
                    return (
                      <span
                        key={name}
                        className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center gap-1 cursor-pointer"
                        onClick={() => removeICPCUser(name)}
                      >
                        {user?.name || name}
                        <XMarkIcon className="h-3 w-3" />
                      </span>
                    );
                  })}
                </div>
                {tempICPCUsers.length < 4 && (
                  <div className="flex gap-2">
                    <select
                      value=""
                      onChange={(e) => addICPCUser(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">{__("admin.contest.add-team-member").replace("{count}", tempICPCUsers.length)}</option>
                      {users.map((user) => (
                        <option
                          key={user.id}
                          value={user.name}
                          disabled={isUserRegistered(user.name) || tempICPCUsers.includes(user.name)}
                        >
                          {user.name} - {user.email}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {tempICPCUsers.length === 4 && (
                  <button
                    type="button"
                     onClick={submitICPCGroup}
                     className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                   >
                     {__("admin.contest.add-team")}
                   </button>
                )}
              </div>
            ) : contest.type === 'Classic' ? (
                <select
                  onChange={(e) => addParticipant(e.target.value)}
                  className="block w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">{__("admin.contest.select-official-participants")}</option>
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
                    <option value="">{__("admin.contest.select-player-1")}</option>
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
                    <option value="">{__("admin.contest.select-player-2")}</option>
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
                  {__("admin.contest.add-players")}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
