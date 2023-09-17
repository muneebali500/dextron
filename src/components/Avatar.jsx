import { useState } from "react";
import pp from "@assets/letter-profile.svg";

// Custom Avatar component
const colorList = [
  { color: "#4F00B2", bg: "#D9BBFF" },
  { color: "#339E00", bg: "#B2DC9E" },
  { color: "#00809D", bg: "#90C8D4" },
  { color: "#E8AB7E", bg: "#CF5800" },
  { color: "#AA0000", bg: "#FFBBBB" },
  { color: "#339E00", bg: "#B2DC9E" },
  { color: "#AA0000", bg: "#FFBBBB" },
  { color: "#E8AB7E", bg: "#CF5800" },
  { color: "#00809D", bg: "#90C8D4" },
  { color: "#4F00B2", bg: "#D9BBFF" },
  { color: "#E8AB7E", bg: "#CF5800" },
];

// choose random color for our Avatar component
const randomColor = () => {
  let luckyNum = Math.floor(Math.random() * colorList.length);
  return colorList[luckyNum];
};

const hashCode = function (s) {
  var h = 0,
    l = s.length,
    i = 0;
  if (l > 0) while (i < l) h = ((h << 5) - h + s.charCodeAt(i++)) | 0;
  return h;
};

// Custom colors can be passed, or a random color can be selected.
// Alternatively, a color index from the predefined list can be used.
// If an ID is provided, the selected color code will be replaced with a randomly chosen option.
const Avatar = ({
  src,
  alt,
  width,
  height,
  bgColor,
  textColor,
  colorCode,
  className,
  onClick,
  id,
}) => {
  if (id && id.length > 0)
    colorCode = Math.abs(hashCode(id)) % colorList.length;
  const [currentState] = useState(randomColor());
  return (
    <div
      onClick={() => onClick && onClick()}
      className={`rounded-full bg-slate-50 flex items-center justify-center cursor-pointer select-none overflow-hidden text-[16px] ${
        className || ""
      }`}
      style={{
        width: width + "px",
        minWidth: width + "px",
        maxWidth: width + "px",
        height: height + "px",
        minHeight: height + "px",
        maxHeight: height + "px",
      }}
    >
      {src ? (
        <img
          className="max-w-full object-cover"
          src={src || pp || ""}
          alt={alt}
        />
      ) : (
        <p
          className="rounded-full h-full flex-grow flex justify-center items-center p-2"
          style={{
            background: bgColor
              ? bgColor
              : colorCode?.toString()?.length > 0
              ? colorList[colorCode]?.bg
              : currentState?.bg,
            color: textColor
              ? textColor
              : colorCode?.toString()?.length > 0
              ? colorList[colorCode]?.color
              : currentState?.color,
          }}
        >
          <span className="">
            {alt?.toString()?.slice(0, 1)?.toUpperCase()}
          </span>
        </p>
      )}
    </div>
  );
};

export default Avatar;
