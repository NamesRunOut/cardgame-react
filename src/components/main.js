import React, { useContext, useState, useEffect } from "react";

import {SocketContext} from '../hooks/Socket.js'
import {CardsPlayed} from "../hooks/CardsPlayed";

import BlackCard from "./BlackCard";
import CardsPlayedDiv from "./CardsPlayed";
import {BlackCardContext} from "../hooks/BlackCard";

const Main = () => {

  return (
    <div className="mainArea">
        <BlackCard />
        <div>
            <CardsPlayed>
                <CardsPlayedDiv />
            </CardsPlayed>
        </div>
    </div>
  );
}

export default Main;