import React, {useState, createContext, useEffect, useContext} from 'react'
import {SocketContext} from "./Socket";
import {BlackCardContext} from "./BlackCard";

export const CardsPlayedContext = createContext()

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

const CardsPlayed = (props) => {
    const socket = useContext(SocketContext)
    const blackType = useContext(BlackCardContext)

    const [cards, setCards] = useState([])
    const [tmpcards, settmpcards] = useState([])

    useEffect(() => {
        setCards([...tmpcards])
    }, [tmpcards])

    useEffect(() => {
        socket.off('highlightCard').on('highlightCard', (cardid, players) => handleHighlight(cardid, players))
    }, [cards])

    const handleHighlight = (cardid, players) => {
        // TODO check later if rendering fine
        console.log('highlight1')
        if (cards.length === 0) return
        let winningPlayer = {id: 'unknown', name: 'unknown'}
        let tmp = []
        for (let i=0;i<cards.length;i++){
            if(cards[i].matchid===cardid) {
                winningPlayer = {id: cards[i].player, name: players[cards[i].player].name}
                break
            }
        }
        switch (blackType){
            case 0:
                for (let i=0;i<cards.length;i++){
                    tmp.push({
                        card: cards[i].card,
                        matchid: cards[i].matchid,
                        player: cards[i].player,
                        playerName: players[cards[i].player].name,
                        chosen: cards[i].player !== winningPlayer.id,
                        revealed: true
                    })
                }
                settmpcards([...tmp])
                break;
            case 2:
            case 3:
                let box = []
                for (let i=0;i<cards.length;i++){
                    for (let j=0;j<cards[i].length;j++){
                        box.push({
                            card: cards[i][j].card,
                            matchid: cards[i][j].matchid,
                            player: cards[i][j].player,
                            playerName: players[cards[i][j].player].name,
                            chosen: cards[i][j].player !== winningPlayer.id,
                            revealed: true
                        })
                    }
                    tmp.push(box)
                }
                settmpcards([...tmp])
                break;
        }
    }

    const handlePlayedCards = (playedCards, type) => {
        console.log('played', cards, playedCards.length, type)
        if (playedCards.length === 0) {
            settmpcards([])
            return
        }
        switch (type){
            case 0:
                //console.log('0')
                settmpcards([...playedCards])
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
                settmpcards([...tmp])
                //console.log('setup', tmp)
                break;
        }
    }

    useEffect(() => {
        socket.on('playedCards', (playedCards, type) => handlePlayedCards(playedCards, type))
        //socket.on('highlightCard', (cardid, players) => handleHighlight(cardid, players))
    }, [])

    return (
        <CardsPlayedContext.Provider value={[cards, setCards]}>
            {props.children}
        </CardsPlayedContext.Provider>
    )
}

export {CardsPlayed}