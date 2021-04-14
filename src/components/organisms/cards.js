import React, {useContext, useRef, useState} from "react";

import {motion} from "framer-motion"

import {PlayerCardsContext} from "../../hooks/PlayerCards";
import Loader from "../atoms/Loader";
import WhiteCard from "../atoms/WhiteCard";
import Blocker from "../atoms/Blocker";

const container = {
    transition: {
      ease: "easeIn",
      duration: 1
  }
};

const Cards = () => {
  const [whiteCards, , loader, message, cardCommited] = useContext(PlayerCardsContext)
console.log('render')
  return (
        <motion.div
            layout
            id="yourCards"
            initial="hidden"
            animate="visible"
            variants={container}
        >
          {loader && <Loader />}
          {message !== null && <Blocker message={message} />}
          {whiteCards?.map(card => <WhiteCard
              key={card?.card?.matchid || 'temp'}
              card={card}
              commitFunction={cardCommited} />)}
        </motion.div>
  );
}

export default Cards;