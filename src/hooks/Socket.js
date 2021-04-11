import React, {useState, createContext, useEffect} from 'react'
import socketIOClient from "socket.io-client";
import {displayCustom, displayMessage} from "../components/organisms/info";

const ENDPOINT = `https://names-cards.herokuapp.com/:${process.env.PORT}`
const socketClient = socketIOClient()

export const SocketContext = createContext()

const Socket = (props) => {
    const [socket] = useState(socketClient);

    return (
        <SocketContext.Provider value={socket}>
            {props.children}
        </SocketContext.Provider>
    )
}

export {Socket}