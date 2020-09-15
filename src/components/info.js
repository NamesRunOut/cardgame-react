import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import '../css/main.css';
import github from '../images/github.svg';
import gmail from '../images/gmail.svg';
import twitter from '../images/twitter.svg'

function Navbar() {
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
                <button type="button" onclick="writeMessage()">Send</button>
              </div>
            </div>
            <div className="info_actions">
                <div className="title">Actions</div>
                <hr />
                <div className="info_actions_action">
                    <div><button type="button" onclick="reroll()">Reroll cards</button></div>
                    <div>Once per game you can reroll all your cards (it has to be on your turn and you can't be the tzar)</div>
                </div>
                <hr />
                <div className="info_actions_action">
                    <div><button type="button" onclick="vote()">Points to all!</button></div>
                    <div>(Usable on tzar turn) If everybody in the lobby presses this button (tzar included), everyone who commited a card will be given a point</div>
                </div>
                <hr />
                <div className="info_actions_action">
                    <div><button type="button" onclick="skip()" id="skipButton">Skip black</button></div>
                    <div>Skip the current black card (30s cooldown per person)</div>
                </div>
                <hr />
                <div className="contact">
                  <a href="https://github.com/NamesRunOut" target="_blank"><img src={github} className="contactImage" /></a>
                  <a href="https://twitter.com/NamesRunOut" target="_blank"><img src={twitter} className="contactImage" /></a>
                  <a href="mailto: namesrunout@gmail.com" target="_blank"><img src={gmail} className="contactImage" /></a>
                </div>
            </div>
      </div>
  );
}

export default Navbar;