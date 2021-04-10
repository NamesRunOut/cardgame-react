import React, { useContext, useState, useEffect } from "react";

import {SocketContext} from '../hooks/Socket.js'
import Placeholders from "./Placeholders";
import CommitedCard from "./CommitedCard";
import {CardsPlayedContext} from "../hooks/CardsPlayed";

// TODO client is recieving player ids, potential sec issue
// TODO blocking from commiting more cards

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
    const [cards, setCards] = useState([])//useContext(CardsPlayedContext)
    // TODO unique keys for 2/3 cards display

    useEffect(() => {
        socket.on('playedCards', function(playedCards, type) {
            //console.log('played', cards, playedCards.length, type)
            if (playedCards.length === 0) {
                setCards([])
                return
            }
            switch (type){
                case 0:
                    //console.log('0')
                    setCards([...playedCards])
                    break;
                case 2:
                case 3:
                    //console.log('2 or 3')
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
                    //console.log('setup', tmp)
                    break;
            }
        })
    }, [socket])

    return (
        <div id="cards">
            <Placeholders />
            {cards.length === 0 ? <></> :
                cards.map(
                    element => {
                        switch(blackType){
                            case 0:
                                return <CommitedCard key={element.matchid} card={element} chosen={!element.chosen} revealed={element.revealed || false} player={element.playerName || 'unknown'} />
                            case 2:
                            case 3:
                                let i=0
                                return <div key={`${i++}box`} className="box">
                                    {element.map(box => {
                                        return <CommitedCard key={`${box.matchid}${i++}`} card={box} chosen={!box.chosen} revealed={box.revealed || false} player={box.playerName || 'unknown'} />
                                    })}
                                </div>
                        }
                    }
                )}
        </div>
    );
}

export default CardsPlayed