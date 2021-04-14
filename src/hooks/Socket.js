import React, {useState, createContext, useEffect} from 'react'
import socketIOClient from "socket.io-client";
import {displayCustom, displayMessage} from "../components/organisms/info";
import io from 'socket.io-client'

const ENDPOINT = "http://127.0.0.1:4001"
const socketClient = socketIOClient(ENDPOINT)
const client = io()

export const SocketContext = createContext()

const Socket = (props) => {
    const [socket] = useState(client);

    socket.on('sessionid', (sessionid) => alert(sessionid))

    return (
        <SocketContext.Provider value={socket}>
            {props.children}
        </SocketContext.Provider>
    )
}

export {Socket}