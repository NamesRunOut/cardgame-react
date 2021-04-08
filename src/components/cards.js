import React, {useContext, useState} from "react";

import {displayMessage} from './info'
import {displayCustom} from './info'

import {SocketContext} from '../hooks/Socket.js'
import {PlayerCardsContext} from "../hooks/PlayerCards";

function makeMessage(text){
  let info = document.createElement("h2");
  info.innerHTML = text;
  let msg = document.createElement("div");
  msg.appendChild(info);
  msg.id = "blocker"
  document.getElementById("yourCards").appendChild(msg);
}

const Cards = () => {
  const socket = useContext(SocketContext)
  //const [whiteCards, setWhiteCards] = useState([])
  const [whiteCards, setWhiteCards] = useContext(PlayerCardsContext)
  //let whiteCards = [];

  function cardCommited(cardid, cardSauceid){
    console.log('commit')
    let tmp = [...whiteCards]
    for (let i in tmp){
      if (cardid===tmp[i].card.matchid) {
        let tmp = [...whiteCards]
        tmp.splice(i, 1);
        //whiteCards.splice(i, 1)
      }
    }
    setWhiteCards([...tmp])
    socket.emit('cardCommited', cardid, cardSauceid);
  }

  function writeCustom(){
    let text = document.getElementById('customInput')?.value || '';
    socket.emit("writeCustom", text);
  }

  function updateWhite(){
    let node = document.getElementById('yourCards');
     node.innerHTML = "";
     for (let id in whiteCards){
       let p = whiteCards[id];
  
       let msg = document.createElement("div");
       msg.className="card";
       msg.onclick = () => cardCommited(p.card.matchid, p.sauce.id);
  
       if (p.sauce.type===0 || p.sauce.type===2){
         msg.innerHTML = p.sauce.text+" ["+p.card.matchid+"]";
       } else if (p.sauce.type===1){
         msg.setAttribute("style", "background-image: url("+p.sauce.text+")")
       }
       document.getElementById("yourCards").appendChild(msg);
     }
  }

  socket.on('recieveWhite', function(id, card, cardSauce) {
    if(cardSauce.type===2) {
      let div1 = document.createElement("div");
       div1.className="info_chat_input";

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
    /*whiteCards.push({
      card: card,
      sauce: cardSauce
    });*/
    setWhiteCards([...whiteCards, {card: card, sauce: cardSauce}])

    let message = {
      date: '',
      author: "white card",
      sauce: "["+card.matchid+"] "+cardSauce.text
    }
    displayMessage(message);

    //updateWhite();
  });
  
  socket.on('loadloader', function(number) {
    let msg = document.createElement("div");
    msg.className="loaderWrapper";
    msg.innerHTML = "<div class=\"wrapper\"><div class=\"dot dot1\"></div><div class=\"dot dot2\"></div><div class=\"dot dot3\"></div><div class=\"dot dot4\"></div><div class=\"dot dot5\"></div><div class=\"dot dot6\"></div><div class=\"dot dot7\"></div><div class=\"dot dot8\"></div><div class=\"dot dot9\"></div><div class=\"dot dot10\"></div><div class=\"dot dot11\"></div></div>"
    document.getElementById("yourCards").appendChild(msg);
  });

  socket.on('unloadloader', function(number) {
    let node = document.getElementById('yourCards');
    node.innerHTML = "";
  });

  socket.on('tzarTurn', function() {  
      makeMessage("You are the tzar, pick a card");
  });

  socket.on('playerWait', function() {
      makeMessage("Tzar is picking a card");
  });

  socket.on('blockTzar', function(tzarid) {
      makeMessage("You are the tzar");
  });

  socket.on('enableCards', function() {
      let node = document.getElementById('blocker');
      if (node===null || node===undefined) return;
      node.parentNode.removeChild(node);
  });

  socket.on('updateWhite', function(id){
    //updateWhite();
  });

  socket.on('clearBoard', function(){
    /*let node = document.getElementById('yourCards');
    node.innerHTML = "";
    whiteCards.splice(0, whiteCards.length);*/
    setWhiteCards([])
  });

  return (
    <div id="yourCards">
      {whiteCards.map(card => {
        return <div
            className='card'
            onClick={() => cardCommited(card.card.matchid, card.sauce.id)}
            style={{backgroundImage: card.sauce.type === 1 ? `url(${card.sauce.text})` : ''}}>
          {(card.sauce.type === 0 || card.sauce.type === 2) ?
              `${card.sauce.text} [${card.card.matchid}]` : ''
          }
        </div>
      })}
    </div>
  );
}

export default Cards;