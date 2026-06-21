import React from "react";

const FormatToUTC = ({ dateTime }) => {
  const monthAbbreviations = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Parse the UTC date string into a Date object
  const date = new Date(dateTime);

  // Calculate the user's UTC offset
  const offsetInMinutes = new Date().getTimezoneOffset();
  const offsetInHours = -offsetInMinutes / 60;

  // Get the UTC date and time components
  const year = date.getUTCFullYear().toString();
  const month = monthAbbreviations[date.getUTCMonth()];
  let day = date.getUTCDate().toString().padStart(2, "0");

  // Adjust the UTC hours by the offset
  let hours = date.getUTCHours() + offsetInHours;
  let minutes = date.getUTCMinutes();

  // Handle hour overflow
  if (hours >= 24) {
    hours -= 24;
    day = (parseInt(day) + 1).toString().padStart(2, "0");
  } else if (hours < 0) {
    hours += 24;
    day = (parseInt(day) - 1).toString().padStart(2, "0");
  }

  // Pad hours and minutes
  hours = hours.toString().padStart(2, "0");
  minutes = minutes.toString().padStart(2, "0");

  return (
    <div>
      <div
        dangerouslySetInnerHTML={{
          __html: `${month}/${day}/${year} ${hours}:${minutes}<sup>UTC${
            offsetInHours >= 0 ? "+" : ""
          }${offsetInHours}</sup>`,
        }}
      ></div>
    </div>
  );
};

export default FormatToUTC;
