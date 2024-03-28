import React from "react";
import { InputWithLabel } from "../../components";

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

export { SearchForm };
