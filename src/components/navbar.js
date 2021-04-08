import React, { useState, useEffect, useContext } from "react";
import '../css/main.css';

import {SocketContext} from '../hooks/Socket.js'

function startGame(socket){
    socket.emit('start');
}

function setDecks(socket){
    let decks=[];
    let cat = document.querySelectorAll(".deck");
    for (let i=0;i<cat.length;i++){
      if (cat[i].checked) decks.push(cat[i].value);
    }
    socket.emit('setDecks', decks);
}

function setPoints(socket){
    let number = document.getElementById("pointsInput").value;
    socket.emit('setPoints', number);
}

function Navbar(props) {
const [response, setResponse] = useState(false);
const socket = useContext(SocketContext)

  useEffect(() => {
    socket.on("startEnable", data => {
      setResponse(false);
    });
    socket.on("startDisable", data => {
      setResponse(true);
    });  
    socket.on('recieveCategories', function(cat){
      for (let i=0;i<cat.length;i++){
        let msg = document.createElement("a");
        msg.innerHTML = "<input type=\"checkbox\" class=\"deck\" value=\""+cat[i].id+"\" checked=\"true\"><label for=\""+cat[i].id+"\">"+cat[i].name+"</label><br>";
        document.getElementById("catplace").appendChild(msg);
      }
    });
  }, [socket]);

  return (
    <div className="navbar" id="player">
      <button type="button" id="startButton" onClick={() => startGame(socket)} disabled={response}>START</button>
      <div className="navbar_points">
          Score limit:
          <select id="pointsInput" defaultValue='5'>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
          </select>
          <div>
            <button type="button" id="pointsButton" onClick={() => setPoints(props.socket)} disabled={response}>Select</button>
          </div>
      </div>
      <div className="navbar_decks">
        <button id="deckButton" onClick={() => setDecks(props.socket)} disabled={response}>Decks select</button>
        <div className="navbar_decks_content" id="catplace"></div>
      </div>
      {response}
    </div>
  );
}

export default Navbar;