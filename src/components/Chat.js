import React, {useContext, useEffect, useState} from "react"
import {SocketContext} from '../hooks/Socket.js'

const updateScroll = () => {
    let element = document.getElementById("chatLog");
    element.scrollTop = element.scrollHeight;
}

export function displayMessage(message){
    let msg = document.createElement("p");
    msg.innerHTML = message.date+" "+message.author+": "+message.sauce;
    document.getElementById("chatLog").appendChild(msg);
    updateScroll();
}

export function displayCustom(message){
    document.getElementById("chatLog").appendChild(message);
    updateScroll();
}

const Chat = () => {
    const socket = useContext(SocketContext)

    document.addEventListener('keydown', logKey);
    function logKey(e) {
        if(e.keyCode===13) {
            writeMessage();
        }
    }

    const writeMessage = () => {
        socket.emit('message', document.getElementById("chatInput").value);
        document.getElementById("chatInput").value="";
    }

    useEffect(() => {
        socket.on('message', function(message) {
            displayMessage(message);
        })
    }, [socket]);

    return (
        <>
            <div>
                <div id="chatLog"></div>
            </div>
            <div className="info_chat_input">
                <input id="chatInput" placeholder="Chat" aria-label="Chat" />
                <button type="button" onClick={writeMessage}>Send</button>
            </div>
        </>
    );
}

export default Chat