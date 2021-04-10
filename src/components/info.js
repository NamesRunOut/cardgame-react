import React from "react";

import Contact from "./Contact";
import Actions from "./Actions";
import Scoreboard from "./Scoreboard";
import Chat from "./Chat";

const Info = () => {
  return (
    <div className="info">
            <div className="info_score">
              <div className="title">Scoreboard<hr /></div>
              <Scoreboard />
            </div>
            <div className="info_chat">
              <Chat />
            </div>
            <div className="info_actions">
                <div className="title">Actions</div>
                <hr />
                <Actions />
                <hr />
                <Contact />
            </div>
      </div>
  );
}

export default Info