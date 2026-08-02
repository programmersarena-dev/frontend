import { XMarkIcon } from '@heroicons/react/24/outline';
import React from 'react'

export default function AdminContestAuthorList({ users, contest, setContest }) {

  const addAuthor = (authorName) => {
    if (authorName && !contest.authors.includes(authorName)) {
      setContest({
        ...contest,
        authors: [...contest.authors, authorName],
      });
    }
  };

  const removeAuthor = (authorName) => {
    setContest({
      ...contest,
      authors: contest.authors.filter((name) => name !== authorName),
    });
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Awtorlar:
      </label>
      <div className="mt-1 flex flex-wrap gap-2">
        {contest?.authors?.length > 0 && contest.authors.map((authorName) => {
          const author = users.find((user) => user.name === authorName);
          return (
            author && (
              <span
                key={authorName}
                className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm cursor-pointer flex items-center gap-1"
                onClick={() => removeAuthor(authorName)}
              >
                {author.name} <XMarkIcon className="h-4 w-4" />
              </span>
            )
          );
        })}
      </div>
      <div className="mt-2">
        <select
          onChange={(e) => addAuthor(e.target.value)}
          className="block w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Awtory saýla</option>
          {users?.length > 0 && users.map((user) => (
            <option key={user.id} value={user.name}>
              {user.name} - {user.email}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
