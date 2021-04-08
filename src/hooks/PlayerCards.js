import React, {useState, createContext} from 'react'

export const PlayerCardsContext = createContext()

const PlayerCards = (props) => {
const [whiteCards, setWhiteCards] = useState([]);

  return (
    <PlayerCardsContext.Provider value={[whiteCards, setWhiteCards]}>
      {props.children}
    </PlayerCardsContext.Provider>
  )
}

export {PlayerCards}