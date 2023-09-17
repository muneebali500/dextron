import { useState } from "react";

export default function TagComponent({ handleTagSelect, tag, addTag, removeTag }) {
    return (
        <li
            className="flex items-center gap-1 border border-[#2A47AB] bg-[#E9F0FF] rounded h-[24px] px-1.5 py-0.5"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
        >
            <button
                key={tag}
                onClick={() => addTag && handleTagSelect(tag)}
                className="text-[12px] font-medium text-[#2A47AB] leading-1"
            >
                {tag}
            </button>

            <span className="text-[#2A47AB]" onClick={() => removeTag && handleTagSelect(tag)}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
                >
                    <path d="M18 6L6 18M6 6l12 12"></path>
                </svg>
            </span>
        </li>
    );
}
