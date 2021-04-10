import React, {useState, createContext, useEffect, useContext} from 'react'
import {SocketContext} from "./Socket";

export const BlackCardContext = createContext()

const BlackCard = (props) => {
    const socket = useContext(SocketContext)
    const [blackType, setBlackType] = useState(null)

    useEffect(() => {
        socket.on('blackCard', function(card) {
            console.log('Blackcard', card)
            setBlackType(card.type)
        });
    }, [socket]);

    return (
        <BlackCardContext.Provider value={blackType}>
            {props.children}
        </BlackCardContext.Provider>
    )
}

export {BlackCard}