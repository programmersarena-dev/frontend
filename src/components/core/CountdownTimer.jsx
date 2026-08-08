import { useState, useEffect } from "react";
import { useTranslation } from "@/contexts/TranslationContext";

const CountdownTimer = ({ dateString, className }) => {
  const { __ } = useTranslation();
  const [difference, setDifference] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const calculateDifference = () => {
      const targetDate = new Date(dateString);
      const currentDate = new Date();
      const diffTime = targetDate - currentDate;
      if (diffTime < 0) {
        setFinished(true);
      } else {
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(
          (diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const diffMinutes = Math.floor(
          (diffTime % (1000 * 60 * 60)) / (1000 * 60)
        );
        const diffSeconds = Math.floor((diffTime % (1000 * 60)) / 1000);

        setDifference({
          days: diffDays,
          hours: diffHours,
          minutes: diffMinutes,
          seconds: diffSeconds,
        });
      }
    };

    calculateDifference();
    const intervalId = setInterval(calculateDifference, 1000);

    return () => clearInterval(intervalId);
  }, [dateString]);

  const renderDifference = () => {
    if (difference.days > 6) {
      return `${Math.floor(difference.days / 7)} ${__("contest.week")}`;
    } else if (difference.days > 0) {
      return `${difference.days} ${__("contest.days")}`;
    } else {
      const formatNumber = (num) => num.toString().padStart(2, "0");
      const hours = formatNumber(difference.hours);
      const minutes = formatNumber(difference.minutes);
      const seconds = formatNumber(difference.seconds);
      if (finished) return ``;
      return `${hours}:${minutes}:${seconds}`;
    }
  };

  return <div className={className}>{renderDifference()}</div>;
};

export default CountdownTimer;
