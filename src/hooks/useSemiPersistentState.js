import { useState, useEffect } from "react";

const useSemiPersistentState = (key, initialState) => {
    const [value, setValue] = useState(localStorage.getItem(key) || initialState);

    useEffect(() => {
        localStorage.setItem(key, value);
    }, [key, value]);

    return [value, setValue];
};

export { useSemiPersistentState };
