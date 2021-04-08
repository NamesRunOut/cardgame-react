import React, { useContext, useState, useEffect } from "react";
import '../css/main.css';

import {SocketContext} from '../hooks/Socket.js'

function insertionSort(inputArr) {
  let n = inputArr.length;
      for (let i = 1; i < n; i++) {
          // Choosing the first element in our unsorted subarray
          let current = inputArr[i];
          // The last element of our sorted subarray
          let j = i-1;
          while ((j > -1) && (current.player < inputArr[j].player)) {
              inputArr[j+1] = inputArr[j];
              j--;
          }
          inputArr[j+1] = current;
      }
  return inputArr;
}

function Main(props) {
  const socket = useContext(SocketContext) 
  const [black, setBlack] = useState(null)
  const [cards, setCards] = useState(null)
  let blackType;
  let allCards = [];
  
  function tzarPicked(cardid){
    socket.emit('tzarPicked', cardid);
  }

  function cardCommited(cardid, cardSauceid){
    //let cardid = document.getElementById("card").value;
    /*if (!acceptCards) return;
    if (blackType==0) acceptCards=false;
    for (let i in whiteCards){
    //  console.log(cardid, whiteCards[i].card.matchid)
      if (cardid==whiteCards[i].card.matchid) whiteCards.splice(i, 1);
    }
    socket.emit('cardCommited', cardid, cardSauceid);*/
  }

  socket.on('playedCards', function(playedCards, type) {
    allCards = playedCards;
  
    let node = document.getElementById('cards');
    node.innerHTML = "";
  
    if (type===0){
        for (let id in playedCards){
          let msg = document.createElement("div");
          msg.className="biggerCard";
          msg.onclick = () => tzarPicked(playedCards[id].matchid);
          msg.innerHTML = playedCards[id].card.text;
  
          if (playedCards[id].card.type===1){
            msg.innerHTML = "";
            msg.setAttribute("style", "background-image: url("+playedCards[id].card.text+")")
          }
  
          document.getElementById("cards").appendChild(msg);
        }
    } else if (type===2 || type===3){
          insertionSort(allCards);
          let boxid = 0;
          let box;
          for (let id=0;id<allCards.length;id++){
              if(id===0 || allCards[id].player!==allCards[id-1].player){
                   box = document.createElement("div");
                   box.className="box";
                   box.id=boxid;
                   document.getElementById("cards").appendChild(box);
                   boxid++;
              }
                  let msg = document.createElement("div");
                  msg.className="biggerCard";
                  msg.onclick = () => tzarPicked(playedCards[id].matchid);
                  msg.innerHTML = playedCards[id].card.text;
                  if (playedCards[id].card.type===1){
                    msg.innerHTML = "";
                    msg.setAttribute("style", "background-image: url("+playedCards[id].card.text+")")
                  }
                  document.getElementById(boxid-1).appendChild(msg);
          }
    }
  });

  socket.on('blackCard', function(card) {
    blackType = card.type;
    setBlack(card)

    /*let node = document.getElementById('blackCard');
    node.innerHTML = "";
  
    let msg = document.createElement("div");
    msg.className = "biggerCard blackCard";
    msg.innerHTML = card.text;
    document.getElementById("blackCard").appendChild(msg);*/
  });

  socket.on('highlightCard', function(cardid, players){
    let node = document.getElementById('cards');
    node.innerHTML = "";
      if (blackType===0){
            for (let id in allCards){
              let msg = document.createElement("div");
              msg.className="biggerCard";
              msg.setAttribute("style", "opacity: 0.5;");
                if (allCards[id].card.type===0 || allCards[id].card.type===2){
                  msg.innerHTML = allCards[id].card.text+" ["+players[allCards[id].player].name+"]";
                  if (allCards[id].matchid===cardid) msg.setAttribute("style", "opacity: 1;");
                } else if (allCards[id].card.type===1){
                  msg.innerHTML = "["+players[allCards[id].player].name+"]";
                  if (allCards[id].matchid===cardid) msg.setAttribute("style", "opacity: 1; background-image: url("+allCards[id].card.text+")")
                  else msg.setAttribute("style", "opacity: 0.5; background-image: url("+allCards[id].card.text+")")
                }
                document.getElementById("cards").appendChild(msg);
            }
      } else if (blackType===2 || blackType===3){
            let boxid = 0;
            let box;
            let winningPlayer ="";
            for (let id=0;id<allCards.length;id++){
              if(allCards[id].matchid===cardid) winningPlayer=allCards[id].player;
            }
            for (let id=0;id<allCards.length;id++){
                if(id===0 || allCards[id].player!==allCards[id-1].player){
                     box = document.createElement("div");
                     box.className="box";
                     box.id=boxid;
                     document.getElementById("cards").appendChild(box);
                     boxid++;
                }
                    let msg = document.createElement("div");
                    msg.className="biggerCard";
                    msg.setAttribute("style", "opacity: 0.5;")
  
                    if (allCards[id].card.type===0 || allCards[id].card.type===2){
                          msg.innerHTML = allCards[id].card.text+" ["+players[allCards[id].player].name+"]";
                          if (allCards[id].player===winningPlayer) msg.setAttribute("style", "opacity: 1;");
                    } else if (allCards[id].card.type===1){
                          msg.innerHTML = "["+players[allCards[id].player].name+"]";
                          if (allCards[id].player===winningPlayer) msg.setAttribute("style", "opacity: 1; background-image: url("+allCards[id].card.text+")")
                          else msg.setAttribute("style", "opacity: 0.5; background-image: url("+allCards[id].card.text+")")
                    }
                    document.getElementById(boxid-1).appendChild(msg);
            }
      }
  });

  socket.on('cardPodiumAndPoints', function() {
    let node = document.getElementById('cards');
    node.innerHTML = "";
  });

  socket.on('playedCardsHidden', function() {
    let msg = document.createElement("div");
    msg.className="biggerCard hidden";

    document.getElementById("cards").appendChild(msg);
});

let mapping = cards === null ?
<div className="card">Your cards will be here</div> 
: cards.map(
  element => {
    //console.log(cards, element)
    if (element.sauce.type===0 || element.sauce.type===2){
      return <div 
        key={element.card.matchid} 
        className="card" 
        onClick={() => cardCommited(element.card.matchid, element.sauce.id)}>
        {element.sauce.text} [{element.card.matchid}]
      </div>
    } else if (element.sauce.type===1){
      return <div 
        key={element.card.matchid} 
        className="card" 
        onClick={() => cardCommited(element.card.matchid, element.sauce.id)}
        style={{backgroundImage: `url(${element.sauce.text})`}}></div>
    }
  }
)

  return (
    <div className="mainArea">
        <div id="blackCard"><div className="biggerCard blackCard">{black === null ? 'Questions will appear here, answer with one (or more) of your cards' : black.text}</div></div>
        <div>
            <div id="cards"></div>
        </div>
    </div>
  );
}

export default Main;