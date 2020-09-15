import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import '../css/main.css';

function Main() {
  return (
    <div className="mainArea">
        <div id="blackCard"></div>
        <div>
            <div id="cards"></div>
        </div>
    </div>
  );
}

export default Main;