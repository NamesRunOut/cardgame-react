import React, {useContext, useState} from "react";

import {PlayerCardsContext} from "../../hooks/PlayerCards";
import Loader from "../atoms/Loader";
import WhiteCard from "../atoms/WhiteCard";
import Blocker from "../atoms/Blocker";

const Cards = () => {
  const [whiteCards, , loader, message, cardCommited] = useContext(PlayerCardsContext)

  return (
    <div id="yourCards">
      {loader && <Loader />}
      {message !== null && <Blocker message={message} />}
      {whiteCards?.map(card => <WhiteCard key={card?.card?.matchid || 'temp'} card={card} commitFunction={cardCommited} />)}
    </div>
  );
}

export default Cards;