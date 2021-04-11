import React, {useContext, useEffect, useState} from "react"
import {SocketContext} from '../../hooks/Socket.js'

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

    const writeCustom = () => {
        let text = document.getElementById('customInput')?.value || '';
        socket.emit("writeCustom", text);
    }

    useEffect(() => {
        socket.on('message', function(message) {
            displayMessage(message);
        })
        socket.on('recieveWhite', function(id, card, cardSauce) {
            if(cardSauce.type===2) {
                let div1 = document.createElement("div");
                div1.className="info_chat_input";

                /*<div className="info_chat_input">
                  <input id="customInput" placeholder="Tu wpisz tekst customowej karty" aria-label="Tu wpisz tekst customowej karty" />
                  <button type="button" onClick={writeCustom}>Send</button>
                </div>*/

                let inp1 = document.createElement("input");
                inp1.id = "customInput";
                inp1.setAttribute("placeholder", "Tu wpisz tekst customowej karty");
                inp1.setAttribute("aria-label", "Tu wpisz tekst customowej karty");

                let but1 = document.createElement("button");
                but1.setAttribute("type", "button");
                but1.innerHTML = "Send";
                but1.onclick = () => writeCustom();

                div1.appendChild(inp1);
                div1.appendChild(but1);

                displayCustom(div1);
            }

            displayMessage({
                date: '',
                author: "white card",
                sauce: "["+card.matchid+"] "+cardSauce.text
            });
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