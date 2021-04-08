import React, { useContext } from "react";

import {SocketContext} from '../hooks/Socket.js'

import '../css/main.css';

import github from '../images/github.svg';
import gmail from '../images/gmail.svg';
import twitter from '../images/twitter.svg'

import {Link} from 'react-router-dom'

let skipi=true;
let sessionid = "not";

function updateScroll(){
  var element = document.getElementById("chatLog");
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

function Navbar(props) {
  const socket = useContext(SocketContext)

  document.addEventListener('keydown', logKey);
  function logKey(e) {
    if(e.keyCode===13) {
      writeMessage();
    }
  }

  socket.on('message', function(message) {
    displayMessage(message);
  });
  
  function reroll(){
    socket.emit('reroll');
  }
  
  function vote(){
    socket.emit('vote');
  }
  
  function skip(){
    if (!skipi) return;
    skipi=false;
    socket.emit('skipBlack');
    setTimeout(function(){
        skipi=true;
    }, 30000)
  }

  socket.on('sessionid', function(id) {
    sessionid=id;
  });
  
  socket.on('state', function(playerList, players) {
    var node = document.getElementById('scoreboard');
    node.innerHTML = "";
  
    for (let id in playerList){
      let p = players[playerList[id]];
      let status = "";
      let name = p.name;
      if (p.id===sessionid) {
          name+=" (you)";
      }
      if (p.tzar) status="tzar";
      else if (!p.played) status="playing...";
  
      let msg = document.createElement("div");
      msg.className = "playerScore";
      msg.innerHTML = "<div>"+name+" "+status+"</br>Points: "+p.points+"</div><div style=\"opacity: 0.2\">["+playerList[id]+"]</div>";
      document.getElementById("scoreboard").appendChild(msg);
      document.getElementById("scoreboard").appendChild(document.createElement("hr"));
    }
  });
  
  function writeMessage(){
    socket.emit('message', document.getElementById("chatInput").value);
    document.getElementById("chatInput").value="";
  }

  return (
    <div className="info">
            <div className="info_score">
              <div className="title">Scoreboard<hr /></div>
              <div id="scoreboard"></div>
            </div>
            <div className="info_chat">
              <div>
                <div id="chatLog"></div>
              </div>
              <div className="info_chat_input">
                <input id="chatInput" placeholder="Chat" aria-label="Chat" />
                <button type="button" onClick={writeMessage}>Send</button>
              </div>
            </div>
            <div className="info_actions">
                <div className="title">Actions</div>
                <hr />
                <div className="info_actions_action">
                    <div><button type="button" onClick={reroll}>Reroll cards</button></div>
                    <div>Once per game you can reroll all your cards (it has to be on your turn and you can't be the tzar)</div>
                </div>
                <hr />
                <div className="info_actions_action">
                    <div><button type="button" onClick={vote}>Points to all!</button></div>
                    <div>(Usable on tzar turn) If everybody in the lobby presses this button (tzar included), everyone who commited a card will be given a point</div>
                </div>
                <hr />
                <div className="info_actions_action">
                    <div><button type="button" onClick={skip} id="skipButton">Skip black</button></div>
                    <div>Skip the current black card (30s cooldown per person)</div>
                </div>
                <hr />
                <div className="contact">
                  <a href="https://github.com/NamesRunOut" target="_blank" rel="noopener noreferrer"><img src={github} className="contactImage" alt="github" /></a>
                  <a href="https://twitter.com/NamesRunOut" target="_blank" rel="noopener noreferrer"><img src={twitter} className="contactImage" alt="twitter" /></a>
                  <Link to="/contact">
                    <img src={gmail} className="contactImage" alt="mail" />
                  </Link>
                </div>
            </div>
      </div>
  );
}

export default Navbar;