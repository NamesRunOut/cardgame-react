import React from "react"

const WhiteCard = ({card, commitFunction}) => {
    if (card.sauce === undefined || card.card === undefined) return <></>
    return (
        <div className='card'
             onClick={() => commitFunction(card.card.matchid, card.sauce.id)}
             style={{backgroundImage: card.sauce.type === 1 ? `url(${card.sauce.text})` : ''}}>
            {(card.sauce.type === 0 || card.sauce.type === 2) ? `${card.sauce.text} [${card.card.matchid}]` : ''}
        </div>
    )
}

export default WhiteCard