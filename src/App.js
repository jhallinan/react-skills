import React, { useEffect, useRef, useState } from "react";

const initialStories = [
    {
        title: "React",
        url: "https://reactjs.org/",
        author: "Jordan Walke",
        num_comments: 3,
        points: 4,
        objectID: 0,
    },
    {
        title: "Redux",
        url: "https://redux.js.org/",
        author: "Dan Abramov, Andrew Clark",
        num_comments: 2,
        points: 5,
        objectID: 1,
    },
];

const getAsyncStories = () =>
    new Promise((resolve) => setTimeout(() => resolve({ data: { stories: initialStories } }), 2000));

const useSemiPersistentState = (key, initialState) => {
    const [value, setValue] = useState(localStorage.getItem(key) || initialState);

    useEffect(() => {
        localStorage.setItem(key, value);
    }, [key, value]);

    return [value, setValue];
};

const App = () => {
    const [searchTerm, setSearchTerm] = useSemiPersistentState("search", "React");

    const [stories, setStories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    React.useEffect(() => {
        setIsLoading(true);

        getAsyncStories()
            .then((result) => {
                setStories(result.data.stories);
                setIsLoading(false);
            })
            .catch(() => setIsError(true));
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleRemoveStory = (item) => {
        const newStories = stories.filter((story) => item.objectID !== story.objectID);

        setStories(newStories);
    };

    const searchedStories = stories.filter((story) => story.title.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div>
            <h1>My Hacker Stories</h1>

            <InputWithLabel id="search" label="Search" value={searchTerm} isFocused onInputChange={handleSearch}>
                <strong>Search:</strong>
            </InputWithLabel>

            <hr />

            {isError && <p>Something went wrong ...</p>}

            {isLoading ? <p>Loading...</p> : <List list={searchedStories} onRemoveItem={handleRemoveStory} />}
        </div>
    );
};

const InputWithLabel = ({ id, type = "text", value, isFocused, onInputChange, children }) => {
    const inputRef = useRef();

    useEffect(() => {
        if (isFocused && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isFocused]);

    return (
        <>
            <label htmlFor={id}>{children}</label>
            &nbsp;
            <input ref={inputRef} id={id} type={type} value={value} autoFocus={isFocused} onChange={onInputChange} />
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
    <li key={item.objectID}>
        <span>
            <a href={item.url}>{item.title}</a>
        </span>
        <span>{item.author}</span>
        <span>{item.num_comments}</span>
        <span>{item.points}</span>
        <span>
            <button type="button" onClick={() => onRemoveItem(item)}>
                Dismiss
            </button>
        </span>
    </li>
);

export default App;
