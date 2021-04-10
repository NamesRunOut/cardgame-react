import React, { useContext, useState, useEffect } from "react";

import {SocketContext} from '../hooks/Socket.js'
import BlackCard from "./BlackCard";
import CardsPlayed from "./CardsPlayed";

const Main = () => {
    const socket = useContext(SocketContext)
    const [blackType, setBlackType] = useState(null)

    useEffect(() => {
        socket.on('blackCard', function(card) {
            //console.log('Blackcard', card)
            setBlackType(card.type)
        });
        }, [socket]);

  return (
    <div className="mainArea">
        <BlackCard />
        <div>
            <CardsPlayed blackType={blackType} />
        </div>
    </div>
  );
}

export default Main;