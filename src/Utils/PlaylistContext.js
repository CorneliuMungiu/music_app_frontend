import React, { createContext, useState } from 'react';

export const PlayListContext = createContext();

export const PlayListProvider = ({ children }) => {
    const [playLists, setPlayLists] = useState([]);

    return (
        <PlayListContext.Provider value={{ playLists, setPlayLists }}>
            {children}
        </PlayListContext.Provider>
    );
};
