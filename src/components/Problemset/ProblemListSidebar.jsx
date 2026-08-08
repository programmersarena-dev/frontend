import { useTranslation } from "../../contexts/TranslationContext";

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
  const { __ } = useTranslation();

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
    <div className="text-sm space-y-6">
      {/* Filter problems */}
      <div>
        <div className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-3">
          {__("problem.filter")}
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 w-16">{__("problem.difficulty")}</span>
            <input
              type="number"
              value={difficultyMin}
              onChange={(e) => setDifficultyMin(e.target.value)}
              className="w-14 bg-zinc-100 rounded py-1 px-2 text-zinc-800 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:bg-white transition-colors"
            />
            <span className="text-zinc-300">–</span>
            <input
              type="number"
              value={difficultyMax}
              onChange={(e) => setDifficultyMax(e.target.value)}
              className="w-14 bg-zinc-100 rounded py-1 px-2 text-zinc-800 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:bg-white transition-colors"
            />
          </div>
          <button
            onClick={handleDifficultyChange}
            className="w-full bg-teal-600 text-white py-1.5 rounded text-xs font-medium hover:bg-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:ring-offset-1 transition-colors"
          >
            {__("problem.apply")}
          </button>
        </div>
      </div>

      {/* Settings */}
      <div>
        <div className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-3">
          {__("problem.settings")}
        </div>
        <div className="space-y-2.5">
          <label className="flex items-center gap-2 cursor-pointer text-zinc-600 hover:text-zinc-900 transition-colors">
            <input
              type="checkbox"
              className="h-3.5 w-3.5 rounded-sm accent-teal-600"
              checked={showTags}
              onChange={handleShowTagsChange}
            />
            {__("problem.show-tags")}
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-zinc-600 hover:text-zinc-900 transition-colors">
            <input
              type="checkbox"
              className="h-3.5 w-3.5 rounded-sm accent-teal-600"
              checked={hideSolved}
              onChange={handleHideSolvedChange}
            />
            {__("problem.hide-solved")}
          </label>
        </div>
      </div>
    </div>
  );
}