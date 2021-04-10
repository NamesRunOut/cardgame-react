import React, {useContext, useEffect, useState} from "react";
import {SocketContext} from '../hooks/Socket.js'

const Scoreboard = () => {
    const socket = useContext(SocketContext)
    const [sessionid, setSessionid] = useState("not")
    const [players, setPlayers] = useState([])

    useEffect(() => {
        socket.on('sessionid', function(id) {
            setSessionid(id)
        });
        socket.on('state', function(playerList, players) {
            let tmp = []
            for (let id in playerList){
                let p = players[playerList[id]]

                let name = p.name
                if (p.id === sessionid) name += " (you)"

                let status = ""
                if (p.tzar) status = "tzar"
                else if (!p.played) status = "playing..."
                tmp.push({
                    name: name,
                    status: status,
                    points: p.points,
                    id: playerList[id]
                })
            }
            setPlayers([...tmp])
        })
    }, [socket]);

    return (
        <div id="scoreboard">
            {
                players.length === 0 ? <></> :
                    players.map(player => <span key={`${player.id}1`}>
                        <div className="playerScore">
                            <div>
                                {player.name} {player.status}<br />
                                Points: {player.points}
                                <span style={{opacity: '0.2', marginLeft: '0.25em'}}>
                                    [{player.id}]
                                </span>
                            </div>
                        </div>
                        <hr  />
                    </span>)
            }
        </div>
    );
}

export default Scoreboard