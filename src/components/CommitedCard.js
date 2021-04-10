import React, {useContext} from "react"
import {SocketContext} from "../hooks/Socket";

const CommitedCard = ({card, chosen, revealed, player}) => {
    const socket = useContext(SocketContext)

    const tzarPicked = (cardid) => {
        if (revealed) return
        socket.emit('tzarPicked', cardid);
    }

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