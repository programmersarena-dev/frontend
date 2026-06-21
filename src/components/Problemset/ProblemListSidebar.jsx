import { useStateContext } from "../../contexts/ContextProvider";

export default function ProblemListSidebar({
  showTags,
  setShowTags,
  hideSolved,
  setHideSolved,
  difficultyMin,
  setDifficultyMin,
  difficultyMax,
  setDifficultyMax,
  onReload,
}) {
  const { t } = useStateContext();

  const handleShowTagsChange = () => {
    setShowTags(!showTags);
  };

  const handleHideSolvedChange = () => {
    setHideSolved(!hideSolved);
  };

  const handleDifficultyChange = () => {
    onReload();
  };

  return (
    <div className="text-xs">
      {/* Filter problems */}
      <div className="bg-white shadow-md rounded-md p-4 mb-4">
        <div className="text-lg font-medium mb-2">{t("problem.filter")}</div>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-20">{t("problem.difficulty")}:</div>
            <input
              type="number"
              value={difficultyMin}
              onChange={(e) => setDifficultyMin(e.target.value)}
              className="w-12 border border-gray-300 rounded-md py-1 px-2"
            />
            <span className="mx-2">-</span>
            <input
              type="number"
              value={difficultyMax}
              onChange={(e) => setDifficultyMax(e.target.value)}
              className="w-12 border border-gray-300 rounded-md py-1 px-2"
            />
          </div>
          <button
            onClick={handleDifficultyChange}
            className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {t("problem.apply")}
          </button>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white shadow-md rounded-md p-4 mb-4">
        <div className="text-lg font-medium mb-2">{t("problem.settings")}</div>
        <div className="flex flex-col space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-indigo-600"
              checked={showTags}
              onChange={handleShowTagsChange}
            />
            <span className="ml-2">{t("problem.show-tags")}</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-indigo-600"
              checked={hideSolved}
              onChange={handleHideSolvedChange}
            />
            <span className="ml-2">{t("problem.hide-solved")}</span>
          </label>
        </div>
      </div>
    </div>
  );
}
