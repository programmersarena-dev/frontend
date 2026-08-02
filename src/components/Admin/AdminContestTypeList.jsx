export default function AdminContestTypeForm({ contest, setContest, contestTypes }) {
  const editType = (e) => {
    if (contest.type !== e.target.value) {
      setContest({
        ...contest,
        participants: {
          official: [], unofficial: []
        },
        type: e.target.value,
      });
    } else {
      setContest({
        ...contest,
        type: e.target.value,
      });
    }
  }

  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Type:
        </label>
        <div className="mt-2">
          <select
            name="type"
            value={contest.type || ""}
            onChange={editType}
            className="block w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select Type</option>
            {contestTypes.length > 0 && contestTypes.map((type, id) => (
              <option key={id} value={type.name}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
      </div >
    </>
  );
}
