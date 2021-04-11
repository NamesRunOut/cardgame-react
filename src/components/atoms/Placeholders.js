import React, {useContext, useEffect, useState} from "react";
import {SocketContext} from "../../hooks/Socket";

const Placeholders = () => {
    const socket = useContext(SocketContext)
    const [placeholder, setPlaceholder] = useState([])
    const [tmp, setTmp] = useState(0)

    useEffect(() => {
        if (tmp !== 0) setPlaceholder([...placeholder, tmp])
        else setPlaceholder([])
    }, [tmp])

    useEffect(() => {
        socket.on('playedCardsHidden', function() {
            setTmp(tmp => tmp + 1)
        })
        socket.on('playedCards', function(playedCards, type) {
            setTmp(0)
        })
        socket.on('highlightCard', function(cardid, players){
            setTmp(0)
        })
    }, [socket]);

    return (
        <>
            {placeholder.length > 0 ? placeholder.map(card => <div key={card} className="biggerCard hidden" />) : <></>}
        </>
    )
}

export default Placeholders