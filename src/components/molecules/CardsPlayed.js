import React, { useContext, useState, useEffect } from "react";

import {SocketContext} from '../../hooks/Socket.js'
import Placeholders from "../atoms/Placeholders";
import CommitedCard from "../atoms/CommitedCard";
import {CardsPlayedContext} from "../../hooks/CardsPlayed";
import {BlackCardContext} from "../../hooks/BlackCard";

// TODO blocking from commiting more cards

const CardsPlayed = () => {
    const [cards] = useContext(CardsPlayedContext)
    const blackType = useContext(BlackCardContext)//useState(null)

    // TODO unique keys for 2/3 cards display
    // TODO check later if rendering fine

    return (
        <div id="cards">
            <Placeholders />
            {cards.length === 0 ? <></> :
                cards.map(
                    element => {
                        switch(blackType){
                            case 0:
                                return <CommitedCard key={element.matchid} card={element} chosen={!element.chosen} revealed={element.revealed || false} playerName={'jhg'} player={element.player || 'unknown'} />
                            case 2:
                            case 3:
                                let i=0
                                return <div key={`${i++}box`} className="box">
                                    {element.map(box => {
                                        return <CommitedCard key={`${box.matchid}${i++}`} card={box} chosen={!box.chosen} revealed={box.revealed || false} playerName={'jhg'} player={box.player || 'unknown'} />
                                    })}
                                </div>
                        }
                    }
                )}
        </div>
    );
}

export default CardsPlayed