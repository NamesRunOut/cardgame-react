import React, {useContext} from 'react';

import Navbar from '../components/organisms/navbar.js'
import Main from '../components/organisms/main.js'
import Cards from '../components/organisms/cards.js'
import Info from '../components/organisms/info.js'

import {SocketContext} from '../hooks/Socket.js'
import {PlayerCards} from '../hooks/PlayerCards.js'
import {CardsPlayed} from "../hooks/CardsPlayed";
import {BlackCard} from "../hooks/BlackCard";

let nickname = "unknown";

export function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

const Homepage = () => {
  const socket = useContext(SocketContext)

  window.onload = function() {
    socket.emit('new player');
    checkCookie();
  };
  
  window.onbeforeunload = closingCode;
  function closingCode(){
    let date = new Date();
    let input = {
      date: "["+String(date.getHours()).padStart(2,"0")+":"
      +String(date.getMinutes()).padStart(2,"0")+":"
      +String(date.getSeconds()).padStart(2,"0")+"]",
      author: nickname,
      sauce: "leaves the game"
    }
    socket.emit('disconnect');
    socket.emit('message', input);
    socket.emit('leaverTrigger');
    return null;
  }

  function checkCookie() {
    var username = getCookie("username");
    if (username !== "") {
     socket.emit('updateName', username);
     nickname = username;
    } else {
      username = prompt("Please enter your nickname", "");
      socket.emit('updateName', username);
      if (username !== "" && username !== null && username!==undefined) {
          setCookie("username", username, 1);
      }
    }
  }

  function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  return (
      <div id="wrapper">
          <Navbar />
            <BlackCard>
              <Main  />
              <PlayerCards>
                <Cards  />
              </PlayerCards>
          </BlackCard>
          <Info />
      </div>
  );
}

export default Homepage;
