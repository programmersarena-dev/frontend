export default function CalculateDiff({ startDate, endDate, showSeconds = true, className }) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const differenceInMilliseconds = end - start;

  if (differenceInMilliseconds < 0) {
    return "";
  }

  const totalSeconds = Math.floor(differenceInMilliseconds / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
    2,
    "0"
  );
  const seconds = String(totalSeconds % 60).padStart(2, "0");

  return <div className={className}>{`${hours}:${minutes}${showSeconds ? ":" + seconds : ""}`}</div>;
}
