import React, {useContext, useEffect} from "react"
import {SocketContext} from "../hooks/Socket";
import {BlackCardContext} from "../hooks/BlackCard";

const CommitedCard = ({card, chosen, revealed, player}) => {
    const socket = useContext(SocketContext)

    const tzarPicked = (cardid) => {
        if (revealed) return
        socket.emit('tzarPicked', cardid);
    }

    useEffect(() => {
        console.log(card)
        socket.on('highlightCard', function(cardid, players){
            console.log('highlight', cardid, card.matchid)
            /*let tmp = []
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
            console.log(tmp)*/
        })
    }, [socket]);

    //console.log(card, chosen, revealed, player)
    //console.log('card')

    if (card.card.type===0 || card.card.type===2) {
        return <div
            key={card.matchid}
            className="biggerCard"
            onClick={() => tzarPicked(card.matchid)}
            style={{opacity: chosen ? '1' : '0.5'}} >
            {card.card.text} {revealed ? `[${player}]` : ''}
        </div>
    } else if (card.card.type===1){
        return <div
            key={card.matchid}
            className="biggerCard"
            onClick={() => tzarPicked(card.matchid)}
            style={{backgroundImage: `url(${card.card.text})`, opacity: chosen ? '1' : '0.5'}}>
            {revealed ? `[${player}]` : ''}
        </div>
    }
    return <></>
}

export default CommitedCard