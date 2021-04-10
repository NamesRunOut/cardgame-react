import React, {useContext} from "react"
import {SocketContext} from "../hooks/Socket";

const CommitedCard = ({card}) => {
    const socket = useContext(SocketContext)

    const tzarPicked = (cardid) => {
        socket.emit('tzarPicked', cardid);
    }

    if (card.card.type===0 || card.card.type===2) {
        return <div
            key={card.matchid}
            className="biggerCard"
            onClick={() => tzarPicked(card.matchid)}>
            {card.card.text}
        </div>
    } else if (card.card.type===1){
        return <div
            key={card.matchid}
            className="biggerCard"
            onClick={() => tzarPicked(card.matchid)}
            style={{backgroundImage: `url(${card.card.text})`}}/>
    }
    return <></>
}

export default CommitedCard