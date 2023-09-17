export default function OptionItem({ option, isChecked, onClick, style }) {
    return (
        <li className="hover:bg-[#EFEFEF] flex items-center gap-2 py-1 px-2 cursor-pointer" onClick={onClick}>
            {/* Checkbox and label */}
            <input
                htmlFor={option.name}
                type="checkbox"
                checked={isChecked}
                onChange={(e) => {
                    // Prevent checkbox interaction
                }}
            />
            <label
                id={option.name}
                style={{
                    backgroundColor: `${option.bg || ""}`,
                }}
                className={`py-1 rounded cursor-pointer text-sm font-medium ${style}`}
            >
                {option.name}
            </label>
        </li>
    );
}
