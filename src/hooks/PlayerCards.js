import React, {useState, createContext, useEffect, useContext} from 'react'
import {displayCustom, displayMessage} from "../components/molecules/Chat";
import {SocketContext} from "./Socket";
import {BlackCardContext} from "./BlackCard";

export const PlayerCardsContext = createContext()

const PlayerCards = (props) => {
  const blackType = useContext(BlackCardContext)
  const socket = useContext(SocketContext)

  const [whiteCards, setWhiteCards] = useState([])
  const [message, setMessage] = useState(null)
  const [loader, setLoader] = useState(false)

  const [commit, setCommit] = useState({
    canCommit: true,
    commitCount: 0
  })

  const [tmp, setTmp] = useState([])

  const cardCommited = (cardid, cardSauceid) => {
    //console.log(commit.commitCount, commit.canCommit, blackType)

    let tmpWhite = [...whiteCards]
    if (tmpWhite.length === 0 || !commit.canCommit) return

    switch (blackType){
      case 0:
        if (commit.commitCount >= 0)
          setCommit({
            canCommit: false,
            commitCount: commit.commitCount
          })
          else
            setCommit({
              canCommit: commit.canCommit,
              commitCount: commit.commitCount+1
           })
        break;
      case 2:
        if (commit.commitCount >= 1)
          setCommit({
            canCommit: false,
            commitCount: commit.commitCount
          })
        else
          setCommit({
            canCommit: commit.canCommit,
            commitCount: commit.commitCount+1
          })
        break;
      case 3:
        if (commit.commitCount >= 2)
          setCommit({
            canCommit: false,
            commitCount: commit.commitCount
          })
        else
        setCommit({
          canCommit: commit.canCommit,
          commitCount: commit.commitCount+1
        })
        break;
    }
    //console.log('white', tmpWhite)
    //setCanCommit(false)
    for (let i=0;i<tmpWhite.length;i++){
      if (tmpWhite[i].card === undefined) {
        tmpWhite.splice(i, 1)
        continue
      }
      if (cardid===tmpWhite[i].card.matchid)
        tmpWhite.splice(i, 1)
    }
    setWhiteCards([...tmpWhite])
    socket.emit('cardCommited', cardid, cardSauceid);
  }

  // TODO cards block on commit, confirm selection

  useEffect(() => {
    tmp !== [] && setWhiteCards([...whiteCards, tmp])
  }, [tmp]);

  useEffect(() => {
    socket.on('recieveWhite', function(id, card, cardSauce) {
      setTmp({card: card, sauce: cardSauce})

      /*if(cardSauce.type===2) {
        let div1 = document.createElement("div");
        div1.className="info_chat_input";

        /*<div className="info_chat_input">
          <input id="customInput" placeholder="Tu wpisz tekst customowej karty" aria-label="Tu wpisz tekst customowej karty" />
          <button type="button" onClick={writeCustom}>Send</button>
        </div>*/

        /*let inp1 = document.createElement("input");
        inp1.id = "customInput";
        inp1.setAttribute("placeholder", "Tu wpisz tekst customowej karty");
        inp1.setAttribute("aria-label", "Tu wpisz tekst customowej karty");

        let but1 = document.createElement("button");
        but1.setAttribute("type", "button");
        but1.innerHTML = "Send";
        but1.onclick = () => writeCustom();

        div1.appendChild(inp1);
        div1.appendChild(but1);

        displayCustom(div1);
      }

      displayMessage({
        date: '',
        author: "white card",
        sauce: "["+card.matchid+"] "+cardSauce.text
      });*/
    })

    socket.on('loadloader', function(number) {
      setLoader(true)
    })

    socket.on('unloadloader', function(number) {
      setLoader(false)
    })

    socket.on('tzarTurn', function() {
      setMessage('You are the tzar, pick a card')
      setCommit({
        canCommit: false,
        commitCount: commit.commitCount
      })
    })

    socket.on('playerWait', function() {
      setMessage('Tzar is picking a card')
      setCommit({
        canCommit: false,
        commitCount: commit.commitCount
      })
    })

    socket.on('blockTzar', function(tzarid) {
      setMessage('You are the tzar')
      setCommit({
        canCommit: false,
        commitCount: commit.commitCount
      })
    })

    socket.on('enableCards', function() {
      setMessage(null)
      setCommit({
        canCommit: true,
        commitCount: 0
      })
    })

    socket.on('clearBoard', function() {
      setWhiteCards([])
    })

    socket.on("startDisable", data => {
      setCommit({
        canCommit: true,
        commitCount: 0
      })
    })
  }, [socket]);

  return (
    <PlayerCardsContext.Provider value={[whiteCards, setWhiteCards, loader, message, cardCommited]}>
      {props.children}
    </PlayerCardsContext.Provider>
  )
}

export {PlayerCards}