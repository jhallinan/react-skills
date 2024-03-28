import React, { useEffect, useRef } from "react";

const InputWithLabel = ({ id, type = "text", value, isFocused, onInputChange, children }) => {
    const inputRef = useRef();

    useEffect(() => {
        if (isFocused && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isFocused]);

    return (
        <>
            <label htmlFor={id} className="label">
                {children}
            </label>
            &nbsp;
            <input
                ref={inputRef}
                id={id}
                className="input"
                type={type}
                value={value}
                autoFocus={isFocused}
                onChange={onInputChange}
            />
        </>
    );
};

export { InputWithLabel };
