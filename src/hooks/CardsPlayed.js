import React, {useState, createContext, useEffect, useContext} from 'react'
import {SocketContext} from "./Socket";
import {BlackCardContext} from "./BlackCard";
import {handleHighlight, handlePlayedCards} from "../functions/playedCards";

export const CardsPlayedContext = createContext()

const CardsPlayed = (props) => {
    const socket = useContext(SocketContext)
    const blackType = useContext(BlackCardContext)

    const [cards, setCards] = useState([])
    const [tmpcards, settmpcards] = useState([])

    useEffect(() => {
        setCards([...tmpcards])
    }, [tmpcards])

    useEffect(() => {
        socket.off('highlightCard').on('highlightCard', (cardid, players) => handleHighlight(cardid, players, cards, setCards, settmpcards, blackType))
    }, [cards])

    useEffect(() => {
        socket.on('playedCards', (playedCards, type) => handlePlayedCards(playedCards, type, cards, setCards, settmpcards, blackType))
        //socket.on('highlightCard', (cardid, players) => handleHighlight(cardid, players))
    }, [])

    return (
        <CardsPlayedContext.Provider value={[cards, setCards]}>
            {props.children}
        </CardsPlayedContext.Provider>
    )
}

export {CardsPlayed}