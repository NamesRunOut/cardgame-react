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
    const [cards, setCards] = useState([])

    /*useEffect(() => {
        socket.on('highlightCard', function(cardid, players){
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
                    let box = []
                    for (let i=0;i<cards.length;i++){
                        for (let j=0;j<cards[i].length;j++){
                            box.push({
                                card: cards[i][j].card,
                                matchid: cards[i][j].matchid,
                                player: cards[i][j].player,
                                playerName: players[cards[i][j].player].name,
                                chosen: cards[i][j].player !== winningPlayer,
                                revealed: true
                            })
                        }
                        tmp.push(box)
                    }
                    break;
            }
            console.log(tmp)
            setCards([...tmp])
        })
    }, [socket, cards]);*/

    return (
        <CardsPlayedContext.Provider value={[cards, setCards]}>
            {props.children}
        </CardsPlayedContext.Provider>
    )
}

export {CardsPlayed}