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

// TODO client is recieving player ids, potential sec issue
// TODO blocking from commiting more cards

const CardsPlayed = ({blackType}) => {
    const socket = useContext(SocketContext)
    const [cards, setCards] = useState([])

    useEffect(() => {
        socket.on('playedCards', function(playedCards, type) {
            console.log('played')
            if (playedCards.length === 0) {
                setCards([])
                return
            }
            switch (type){
                case 0:
                    setCards([...playedCards])
                    break;
                case 2:
                case 3:
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
                    console.log('setup', tmp)
                    break;
            }
        })
        /*socket.on('highlightCard', function(cardid, players){
            console.log('highlight')
            if (cards.length === 0) return

            let tmp = []
            let winningPlayer = ""
            for (let i=0;i<cards.length;i++){
                if(cards[i].matchid===cardid) {
                    winningPlayer=cards[i].player
                    break
                }
            }

            switch (blackType){
                case 0:
                    for (let i=0;i<cards.length;i++){
                        //console.log(cards[i].player, winningPlayer, cards[i].player === winningPlayer)
                        tmp.push({
                            card: cards[i].card,
                            matchid: cards[i].matchid,
                            player: cards[i].player,
                            playerName: players[cards[i].player].name,
                            chosen: cards[i].player !== winningPlayer,
                            revealed: true
                        })
                    }
                    break;
                case 2:
                case 3:
                    console.log(players, cards[0].player)

                    let box = [{
                        card: cards[0].card,
                        matchid: cards[0].matchid,
                        player: cards[0].player,
                        playerName: players[cards[0].player].name,
                        chosen: cards[0].player !== winningPlayer,
                        revealed: true
                    }]

                    for (let i=1;i<cards.length;i++){
                        if (cards[i].player === cards[i-1].player)
                            box.push({
                            card: cards[i].card,
                            matchid: cards[i].matchid,
                            player: cards[i].player,
                            playerName: players[cards[i].player].name,
                            chosen: cards[i].player !== winningPlayer,
                            revealed: true
                        })
                        else {
                            tmp.push(box)
                            box = [{
                                card: cards[i].card,
                                matchid: cards[i].matchid,
                                player: cards[i].player,
                                playerName: players[cards[i].player].name,
                                chosen: cards[i].player !== winningPlayer,
                                revealed: true
                            }]
                        }
                    }
                    tmp.push(box)
                    console.log(tmp)
                    break;
            }
            console.log(tmp, cards, blackType)
            setCards([...tmp])
        })*/
    }, [socket, cards])

    return (
        <div id="cards">
            <Placeholders />
            {cards.length === 0 ? <></> :
                cards.map(
                    element => {
                        switch(blackType){
                            case 0:
                                return <CommitedCard key={element.matchid} card={element} chosen={!element.chosen} revealed={element.revealed || false} player={element.playerName || 'unknown'} />
                            case 2 || 3:
                                return <div key={`${element.matchid}box`} className="box">
                                    {element.map(box => {
                                        return <CommitedCard key={box.matchid} card={box} chosen={!box.chosen} revealed={box.revealed || false} player={box.playerName || 'unknown'} />
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