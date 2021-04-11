import React, {useState, createContext, useEffect} from 'react'
import socketIOClient from "socket.io-client";
import {displayCustom, displayMessage} from "../components/organisms/info";

const ENDPOINT = "http://127.0.0.1:4001"
const socketClient = socketIOClient(ENDPOINT)

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