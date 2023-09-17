import React, { useState, useEffect } from "react";
import ClickAwayListener from "@helpers/ClickAwayListener";
import dropdownIcon from "@assets/icon-wrapper.svg";
import OptionItem from "./OptionItem";

export default function DriveDropDown({
  title,
  options,
  searchable,
  multiSelect,
  name,
  className,
  txtClass,
  selectedOptions,
  setSelectedOptions,
}) {
  const [dropOptions, setDropOptions] = useState(options);
  const [dropdown, setDropdown] = useState(false);

  useEffect(() => {
    setDropOptions(options);
  }, [options]);

  function handleOptionSelect(opt) {
    setSelectedOptions((prevState) => {
      if (multiSelect) {
        // If it's multi-select
        const updatedOptions = prevState[name].includes(opt)
          ? prevState[name].filter((option) => option !== opt) // Remove the option if already selected
          : [...prevState[name], opt]; // Add the option if not selected
        return { ...prevState, [name]: updatedOptions };
      } else {
        // If it's single-select, directly set the selected option
        const isSelected = prevState[name] === opt;
        return { ...prevState, [name]: isSelected ? "" : opt };
      }
    });
  }

  function handleSearch(e) {
    const filteredOptions = options.filter((opt) =>
      opt.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setDropOptions(filteredOptions);
  }

  const selectedOptionsList = dropOptions
    .filter((option) => selectedOptions[name].includes(option.name))
    .sort((a, b) => a.name.localeCompare(b.name));
  const unselectedOptionsList = dropOptions.filter(
    (option) => !selectedOptions[name].includes(option.name)
  );

  return (
    <ClickAwayListener onClickAway={() => setDropdown(false)}>
      <div className="relative">
        <div
          className={`relative h-10 flex items-center justify-beween gap-1 bg-white border rounded-md py-3 px-2 cursor-pointer mb-1 ${
            dropdown
              ? "border border-[#2A47AB] text-[#2A47AB]"
              : "text-[#9FA2AA]"
          }`}
          onClick={() => setDropdown(!dropdown)}
        >
          <button
            className={`text-left text-ellipsis border-none text-sm outline-none min-w-[50px] max-w-[80px] whitespace-nowrap overflow-hidden`}
          >
            {(multiSelect ? selectedOptions[name][0] : selectedOptions[name]) ||
              title}
          </button>
          <img
            src={dropdownIcon}
            alt="Icon"
            loading="lazy"
            className={`h-3 w-3 top-3.5 ${
              dropdown ? "sepia hue-rotate-190 saturate-500" : "grayscale"
            }`}
          />
        </div>

        {dropdown && (
          <div
            className={`absolute  bg-white border z-40 rounded-lg shadow-[0_9px_28px_#00000014] ${className}`}
          >
            {searchable && (
              <input
                type="text"
                placeholder={`Search ${title}`}
                onChange={handleSearch}
                className="border border-[#2A47AB] w-full block px-3 py-2 text-sm mb-2 rounded h-10 outline-none"
              />
            )}

            <ul className="max-h-[200px] overflow-auto p-2">
              {selectedOptionsList.length > 0 && (
                <>
                  {selectedOptionsList.map((option) => (
                    <OptionItem
                      key={option.name}
                      option={option}
                      isChecked={selectedOptions[name].includes(option.name)}
                      onClick={() => handleOptionSelect(option.name)}
                      style={txtClass}
                    />
                  ))}
                </>
              )}

              {unselectedOptionsList.length > 0 &&
                unselectedOptionsList.map((option) => (
                  <OptionItem
                    key={option.name}
                    option={option}
                    isChecked={selectedOptions[name].includes(option.name)}
                    onClick={() => handleOptionSelect(option.name)}
                    style={txtClass}
                  />
                ))}

              {selectedOptionsList.length === 0 &&
                unselectedOptionsList.length === 0 && (
                  <li className="min-w-[160px] text-gray-400 text-center px-2 py-3 text-xs">
                    No results found.
                  </li>
                )}
            </ul>
          </div>
        )}
      </div>
    </ClickAwayListener>
  );
}
