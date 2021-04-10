import React, { useContext, useState, useEffect } from "react";

import {SocketContext} from '../hooks/Socket.js'
import BlackCard from "./BlackCard";
import CardsPlayed from "./CardsPlayed";

function insertionSort(inputArr) {
  let n = inputArr.length;
      for (let i = 1; i < n; i++) {
          let current = inputArr[i];
          let j = i-1;
          while ((j > -1) && (current.player < inputArr[j].player)) {
              inputArr[j+1] = inputArr[j];
              j--;
          }
          inputArr[j+1] = current;
      }
  return inputArr;
}

const Main = () => {
  const socket = useContext(SocketContext)
  const [blackType, setBlackType] = useState(null)
  
  /*function tzarPicked(cardid){
    socket.emit('tzarPicked', cardid);
  }*/

  useEffect(() => {
      socket.on('blackCard', function(card) {
          setBlackType(card?.type)
      });

      /*socket.on('playedCards', function(playedCards, type) {
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
      });*/
/*
      socket.on('playedCardsHidden', function() {
          let msg = document.createElement("div");
          msg.className="biggerCard hidden";
          document.getElementById("cards").appendChild(msg);
      });*/
    }, [socket]);
/*
    function cardCommited(matchid, id) {
        return undefined;
    }

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
)*/

  return (
    <div className="mainArea">
        <BlackCard />
        <div>
            <CardsPlayed blackType={blackType} />
        </div>
    </div>
  );
}

export default Main;