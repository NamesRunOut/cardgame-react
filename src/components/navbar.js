import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import '../css/main.css';

const ENDPOINT = "http://127.0.0.1:4001";

function startGame(){
    const socket = socketIOClient(ENDPOINT);
    socket.emit('start');
}

function setDecks(){
    const socket = socketIOClient(ENDPOINT);
    //console.log("decks")
    let decks = [];
    let cat = document.querySelectorAll(".deck");
    for (let i=0;i<cat.length;i++){
    if (cat[i].checked) decks.push(cat[i].value);
    }
    socket.emit('setDecks', decks);
}

function Navbar() {
const [response, setResponse] = useState("");

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on("FromAPI", data => {
      setResponse(data);
    });
  }, []);

  return (
    <div className="navbar" id="player">
      <button type="button" id="startButton" onClick={startGame()}>START</button>
      <div className="navbar_points">
          Score limit:
          <select id="pointsInput">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5" selected >5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
          </select>
          <div>
            <button type="button" id="pointsButton" onClick="setPoints()">Select</button>
          </div>
      </div>
      <div className="navbar_decks">
        <button id="deckButton" onClick={setDecks()}>Decks select</button>
        <div className="navbar_decks_content" id="catplace">              
        </div>
      </div>
      {response}
    </div>
  );
}

export default Navbar;