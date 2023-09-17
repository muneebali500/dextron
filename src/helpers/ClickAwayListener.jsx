import { useEffect, useRef } from "react";

const ClickAwayListener = ({ onClickAway, children, className, excludingItem }) => {
    const ref = useRef(null);
    // const ref = propsRef || refM;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (event.target.id === excludingItem) return;
            if (ref.current && !ref.current.contains(event.target)) {
                onClickAway && onClickAway();
            }
        };
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };
    }, [onClickAway]);
    return (
        <div ref={ref} className={`${className ? className : ""}`}>
            {children}
        </div>
    );
};

export default ClickAwayListener;
