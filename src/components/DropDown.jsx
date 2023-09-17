import { useEffect, useState } from "react";
import { searchFilter } from "@helpers/helper";
import ClickAwayListener from "@helpers/ClickAwayListener";

// --------------------- Dropdown select ---------------------------
const DropDown = ({
  name,
  title,
  subTitle,
  options = [],
  selectedOptions,
  textGray,
  handleOptionSelect,
  dark,
  searchInput,
  optionIcon,
  className,
  customList,
  multiSelect,
  btnClass,
  activeBtnClass,
  wrapperClass,
  listWrapperClass,
  inputClass,
  showSelectedVal,
  textClass,
  onCloseMenu,
  disabled,
  itemClass,
  noTruncate,
  trimItems,
  usingDefaultValue = true,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);

  // Update filtered options when search value changes
  useEffect(() => {
    if (customList) return;
    const remainingOptions = searchFilter(searchVal, options);
    setFilteredOptions(remainingOptions);
  }, [searchVal, options]);

  return (
    <ClickAwayListener
      onClickAway={() => {
        setShowMenu(false);
        onCloseMenu && onCloseMenu(selectedOptions);
      }}
      className={`relative ${wrapperClass || ""}`}
    >
      <button
        className={`text-black 
                cursor-pointer 
                flex items-center 
                focus:border-main-blue 
                focus:text-main-blue
                ${
                  showMenu
                    ? textGray
                      ? "border !border-main-blue !text-[#A3AAB5]"
                      : activeBtnClass
                      ? activeBtnClass
                      : "!text-main-blue border !border-main-blue"
                    : " border-[1px] border-[#dbe0e5]"
                }
                ${dark ? "!text-white !border-[#3D3D3D]" : ""}  
                font-medium rounded-lg  
                px-2 py-2  gap-2 text-center 
                truncate overflow-hidden max-w-full text-[14px] ${
                  !multiSelect
                    ? "hover:text-main-blue border hover:border-main-blue"
                    : ""
                }  
                ${!usingDefaultValue ? "border-2 border-blue-500 " : ""}
                ${btnClass || ""}`}
        type="button"
        onClick={() => (disabled ? null : setShowMenu((prev) => !prev))}
      >
        <span className="flex-grow truncate text-left max-w-full">
          {showSelectedVal ? selectedOptions[name][0] || title : title}
        </span>
        {optionIcon && (
          <span className="ml-auto">
            {showMenu ? (
              <svg width="14" height="15" viewBox="0 0 10 12" fill="none">
                <path
                  d="M7.46681 4.78336H4.87097H2.53347C2.13347 4.78336 1.93347 5.26669 2.21681 5.55002L4.37514 7.70836C4.72097 8.05419 5.28347 8.05419 5.62931 7.70836L6.45014 6.88752L7.78764 5.55002C8.06681 5.26669 7.86681 4.78336 7.46681 4.78336Z"
                  fill="#2A47AB"
                />
              </svg>
            ) : (
              <svg width="14" height="15" viewBox="0 0 10 12" fill="none">
                <path
                  d="M7.46681 4.78333H4.87097H2.53347C2.13347 4.78333 1.93347 5.26666 2.21681 5.54999L4.37514 7.70832C4.72097 8.05416 5.28347 8.05416 5.62931 7.70832L6.45014 6.88749L7.78764 5.54999C8.06681 5.26666 7.86681 4.78333 7.46681 4.78333Z"
                  fill="#5B6B79"
                />
              </svg>
            )}
          </span>
        )}
      </button>
      {showMenu && (
        <div
          className={`z-10 absolute max-h-[75vh] overflow-y-auto top-[107%] w-max max-w-[28rem] ${
            dark
              ? "border-[#3d3d3] bg-[#282828] text-white"
              : "border-slate-200 bg-white text-black"
          }  rounded-lg shadow-[0_2px_15px_rgba(0,0,0,0.15)]  ${
            className || ""
          }`}
        >
          {customList ? (
            customList
          ) : (
            <>
              {searchInput === true && (
                <>
                  <div className="sticky top-0 left-0 bg-white z-[2] p-[0.15rem]">
                    <input
                      autoFocus
                      onChange={(e) => setSearchVal(e.target.value)}
                      value={searchVal}
                      type="text"
                      placeholder={
                        typeof title === "string" ? title : subTitle || name
                      }
                      className={`w-[100%] h-[25px] py-5 px-2 rounded border border-gray-200 outline-0 ${
                        dark ? "bg-[#282828] placeholder:text-sm" : ""
                      } focus:outline-[1px] outline-[--main-blue] focus:ring focus:ring-[#d1e9ff] ${
                        inputClass || ""
                      }`}
                      style={{ outlineStyle: "solid" }}
                    />
                  </div>
                </>
              )}
              <ul
                className={`p-2 space-y-1 text-sm text-gray-700 ${
                  listWrapperClass || ""
                }`}
              >
                {filteredOptions?.length > 0 ? (
                  filteredOptions?.slice(0, trimItems)?.map((opt, i) => (
                    <li key={i}>
                      {multiSelect ? (
                        <div
                          className={`flex items-center px-2 py-[4px] ${
                            itemClass || ""
                          }`}
                        >
                          <>
                            <input
                              id={`checkbox-item-${i}`}
                              type="checkbox"
                              value={opt}
                              checked={
                                selectedOptions[name]?.find((n) => n === opt)
                                  ? true
                                  : false
                              }
                              onChange={(e) =>
                                handleOptionSelect &&
                                handleOptionSelect(name, e)
                              }
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded mr-2 cursor-pointer"
                            />
                            <label
                              htmlFor={`checkbox-item-${i}`}
                              className={`text-sm font-medium select-none cursor-pointer w-full text-gray-900 max-w-[260px] ${
                                textClass || ""
                              } ${noTruncate ? " " : "truncate"}`}
                            >
                              {opt} {console.log(opt === "Tags")}
                            </label>
                          </>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          {/* <input
                                                        id={`radio-item-${i}`}
                                                        type="radio"
                                                        value={opt}
                                                        name={`radio-item-${i}`}
                                                        checked={selectedOptions[name]?.find((n) => n === opt) ? true : false}
                                                        onChange={(e) => handleOptionSelect && handleOptionSelect(name, e)}
                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded mr-2"
                                                    />
                                                    <label
                                                        htmlFor={`radio-item-${i}`}
                                                        className={`text-sm font-medium select-none cursor-pointer w-full  truncate max-w-[260px] ${dark ? "text-white":"text-gray-900"}`}
                                                    >
                                                        {opt}
                                                    </label> */}
                          <span
                            onClick={() =>
                              handleOptionSelect
                                ? handleOptionSelect(name, {
                                    target: { value: opt },
                                  })
                                : setShowMenu(false)
                            }
                            className={`block rounded p-2 text-sm font-medium select-none cursor-pointer w-full truncate  ${
                              dark ? "text-white" : "text-gray-900"
                            } max-w-full ${
                              selectedOptions[name]?.find((n) => n === opt)
                                ? dark
                                  ? "bg-gray-700"
                                  : "bg-gray-100"
                                : ""
                            } ${textClass}`}
                          >
                            {opt}
                          </span>
                        </div>
                      )}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400 text-center p-2">
                    No results found.
                  </li>
                )}
              </ul>
            </>
          )}
        </div>
      )}
    </ClickAwayListener>
  );
};

export default DropDown;
