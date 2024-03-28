import React, { useCallback, useEffect, useReducer, useState } from "react";
import "./App.css";
import { storiesReducer } from "./reducers/storiesReducer";
import { useSemiPersistentState } from "./hooks/useSemiPersistentState";
import { List, SearchForm } from "./components";

const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";

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

export default App;
