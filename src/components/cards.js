import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import '../css/main.css';

const ENDPOINT = "http://127.0.0.1:4001";
const socket = socketIOClient(ENDPOINT);

socket.on('tzarTurn', function(tzar) {
    //console.log(tzar.id, socketid)
    let info = document.createElement("h2");
    /*if (tzar.id==socketid) {
        // you are the tzar
        info.innerHTML = "You are the tzar, pick a card";
    } else {
        // your are not the tzar
        info.innerHTML = "Tzar is picking a card";
    }*/

    let msg = document.createElement("div");
    msg.appendChild(info);
    msg.id = "blocker"
    document.getElementById("yourCards").appendChild(msg);
});

socket.on('blockTzar', function(tzarid) {
  let info = document.createElement("h2");

  info.innerHTML = "You are the tzar";

  let msg = document.createElement("div");
  msg.appendChild(info);
  msg.id = "blocker"
  document.getElementById("yourCards").appendChild(msg);
});

socket.on('enableCards', function() {
  let node = document.getElementById('blocker');
  node.parentNode.removeChild(node);
});

function Cards() {
  return (
    <div id="yourCards"></div>
  );
}

export default Cards;