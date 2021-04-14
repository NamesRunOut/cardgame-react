import React, { useState, useEffect, useContext } from "react";

import {SocketContext} from '../../hooks/Socket.js'
import StartButton from "../atoms/StartButton";
import Points from "../molecules/Points";
import Decks from "../molecules/Decks";
import DragButton from "../atoms/DragButton";

const Navbar = () => {
    const socket = useContext(SocketContext)
    const [response, setResponse] = useState(false)

  useEffect(() => {
    socket.on("startEnable", data => {
      setResponse(false)
    })
    socket.on("startDisable", data => {
      setResponse(true)
    })
  }, [socket]);

  return (
    <div className="navbar" id="player">
      <StartButton response={response} />
      <Points response={response} />
      <Decks response={response} />
      <DragButton />
    </div>
  );
}

export default Navbar