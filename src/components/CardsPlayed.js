import React, { useContext, useState, useEffect } from "react";

import {SocketContext} from '../hooks/Socket.js'
import Placeholders from "./Placeholders";
import CommitedCard from "./CommitedCard";

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

const CardsPlayed = ({blackType}) => {
    const socket = useContext(SocketContext)
    const [cards, setCards] = useState([])

    useEffect(() => {
        socket.on('playedCards', function(playedCards, type) {
            switch (type){
                case 0:
                    setCards([...playedCards])
                    break;
                case 2 || 3:
                    let played = playedCards
                    insertionSort(played)
                    let box = [played[0]]
                    let tmp = []
                    for (let i=1;i<played.length;i++){
                        if (played[i].player === played[i-1].player) box.push(played[i])
                        else {
                            tmp.push(box)
                            box = [played[i]]
                        }
                    }
                    tmp.push(box)
                    setCards([...tmp])
                    console.log(tmp)
                    break;
                default:
                    setCards([])
                    break;
            }
        });
/*
        socket.on('highlightCard', function(cardid, players){
            //let node = document.getElementById('cards');
            //node.innerHTML = "";
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
    }, [socket]);

    return (
        <div id="cards">
            <Placeholders />
            {cards.length === 0 ? <></> :
                cards.map(
                    element => {
                        switch(blackType){
                            case 0:
                                return <CommitedCard key={element.matchid} card={element} chosen={true} />
                            case 2 || 3:
                                return <div className="box">
                                    {element.map(box => {
                                        return <CommitedCard key={box.matchid} card={box} chosen={true} />
                                    })}
                                </div>
                            default:
                                return <></>
                        }
                    }
                )}
        </div>
    );
}

export default CardsPlayed