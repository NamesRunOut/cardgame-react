import React, {useState, createContext, useEffect, useContext} from 'react'

export const SettingsContext = createContext()

const Settings = (props) => {
    const [canDrag, setCanDrag] = useState(false)

    return (
        <SettingsContext.Provider value={[canDrag, setCanDrag]}>
            {props.children}
        </SettingsContext.Provider>
    )
}

export {Settings}