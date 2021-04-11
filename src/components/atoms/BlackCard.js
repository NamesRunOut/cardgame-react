import React, {useContext, useEffect, useState} from "react"
import {SocketContext} from '../../hooks/Socket.js'

const BlackCard = () => {
  const socket = useContext(SocketContext)
    const [black, setBlack] = useState(null)

    useEffect(() => {
        socket.on('blackCard', function(card) {
            setBlack(card)
        });
    }, [socket]);

  return (
      <div id="blackCard">
          <div className="biggerCard blackCard">
              {black === null ? 'Questions will appear here, answer with one (or more) of your cards' : black.text}
          </div>
      </div>
  );
}

export default BlackCard