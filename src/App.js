import React, { useCallback, useEffect, useReducer, useRef, useState } from "react";
import "./App.css";

const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";

const useSemiPersistentState = (key, initialState) => {
    const [value, setValue] = useState(localStorage.getItem(key) || initialState);

    useEffect(() => {
        localStorage.setItem(key, value);
    }, [key, value]);

    return [value, setValue];
};

const storiesReducer = (state, action) => {
    switch (action.type) {
        case "STORIES_FETCH_INIT":
            return {
                ...state,
                isLoading: true,
                isError: false,
            };
        case "STORIES_FETCH_SUCCESS":
            return {
                ...state,
                isLoading: false,
                isError: false,
                data: action.payload,
            };
        case "STORIES_FETCH_FAILURE":
            return {
                ...state,
                isLoading: false,
                isError: true,
            };
        case "REMOVE_STORY":
            return {
                ...state,
                data: state.data.filter((story) => action.payload.objectID !== story.objectID),
            };
        default:
            throw new Error();
    }
};

const App = () => {
    const [stories, dispatchStories] = useReducer(storiesReducer, { data: [], isLoading: false, isError: false });
    const [searchTerm, setSearchTerm] = useSemiPersistentState("search", "React");
    const [url, setUrl] = useState(`${API_ENDPOINT}${searchTerm}`);

    const handleFetchStories = useCallback(async () => {
        dispatchStories({ type: "STORIES_FETCH_INIT" });

        await fetch(url)
            .then((response) => response.json())
            .then((result) => {
                dispatchStories({ type: "STORIES_FETCH_SUCCESS", payload: result.hits });
            })
            .catch(() => dispatchStories({ type: "STORIES_FETCH_FAILURE" }));
    }, [url]);

    useEffect(() => {
        handleFetchStories();
    }, [handleFetchStories]);

    const handleSearchInput = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        setUrl(`${API_ENDPOINT}${searchTerm}`);
    };

    const handleRemoveStory = (item) => {
        dispatchStories({ type: "REMOVE_STORY", payload: item });
    };

    return (
        <div className="container">
            <h1 className="headline-primary">My Hacker Stories</h1>

            <SearchForm searchTerm={searchTerm} onSearchInput={handleSearchInput} onSearchSubmit={handleSearchSubmit} />

            <hr />

            {stories.isError && <p>Something went wrong ...</p>}

            {stories.isLoading ? <p>Loading...</p> : <List list={stories.data} onRemoveItem={handleRemoveStory} />}
        </div>
    );
};

const SearchForm = ({ searchTerm, onSearchInput, onSearchSubmit }) => (
    <form className="search-form" onSubmit={onSearchSubmit}>
        <InputWithLabel id="search" label="Search" value={searchTerm} isFocused onInputChange={onSearchInput}>
            <strong>Search:</strong>
        </InputWithLabel>

        <button type="submit" disabled={!searchTerm} className="button button_large">
            Submit
        </button>
    </form>
);

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

const List = ({ list, onRemoveItem }) => (
    <ul>
        {list.map((item) => (
            <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
        ))}
    </ul>
);

const Item = ({ item, onRemoveItem }) => (
    <li key={item.objectID} className="item">
        <span style={{ width: "40%" }}>
            <a href={item.url}>{item.title}</a>
        </span>
        <span style={{ width: "30%" }}>{item.author}</span>
        <span style={{ width: "10%" }}>{item.num_comments}</span>
        <span style={{ width: "10%" }}>{item.points}</span>
        <span style={{ width: "10%" }}>
            <button type="button" className="button button_small" onClick={() => onRemoveItem(item)}>
                Dismiss
            </button>
        </span>
    </li>
);

export default App;
