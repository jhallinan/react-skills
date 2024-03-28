import React from "react";

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

export { List };
