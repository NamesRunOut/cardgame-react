var socket = io();
var nickname = "unknown";
var socketid = "not";

var whiteCards = [];
var allCards = [];
var decks = [];

var acceptCards = false;
var blackType;

var skipi = true;

window.onload = function() {
    socket.emit('new player');
    checkCookie();
    /*nickname = prompt("Please enter your nickname");
    socket.emit('updateName', nickname);*/
    //console.log(nickname);
};

window.onbeforeunload = closingCode;
function closingCode(){
  let date = new Date();
  let input = {
    date: "["+String(date.getHours()).padStart(2,"0")+":"
    +String(date.getMinutes()).padStart(2,"0")+":"
    +String(date.getSeconds()).padStart(2,"0")+"]",
    author: nickname,
    sauce: "leaves the game"
  }
  socket.emit('disconnect');
  socket.emit('message', input);
  socket.emit('leaverTrigger');
  return null;
}

function updateScroll(){
    var element = document.getElementById("chatLog");
    element.scrollTop = element.scrollHeight;
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
socket.on('sessionId', function(id) {
  setCookie("session", id, 1);
//  console.log("session", id);
});

function startGame(){
  //document.getElementById("startButton").disabled=true;
  socket.emit('start');
}

function tzarPicked(cardid){
  //let cardid = document.getElementById("tzar").value;
  socket.emit('tzarPicked', cardid);
}

function cardCommited(cardid, cardSauceid){
  //let cardid = document.getElementById("card").value;
  if (!acceptCards) return;
  if (blackType==0) acceptCards=false;
  for (let i in whiteCards){
  //  console.log(cardid, whiteCards[i].card.matchid)
    if (cardid==whiteCards[i].card.matchid) whiteCards.splice(i, 1);
  }
  socket.emit('cardCommited', cardid, cardSauceid);
}

var enterPress = document.getElementById('chatInput');
document.addEventListener('keydown', logKey);
function logKey(e) {
  if(e.keyCode==13) {
    writeMessage();
  }
}

socket.on('sessionid', function(id){
  if (socketid!="not") return;
  socketid=id;
  //console.log(id);

   let msg = document.createElement("p");
   msg.className="userid";
   msg.innerHTML = "["+socketid+"]";
   document.getElementById("player").appendChild(msg);
})

function setPoints(){
  let number = document.getElementById("pointsInput").value;
  socket.emit('setPoints', number);
}
function skip(){
  if (!skipi) return;
  skipi=false;
  socket.emit('skipBlack');
  //document.getElementById("skipButton").disabled=true;
  setTimeout(function(){
      skipi=true;
      //document.getElementById("skipButton").disabled=false;
  }, 30000)
}
function setDecks(){
  //console.log("decks")
  let decks = [];
  let cat = document.querySelectorAll(".deck");

  for (let i=0;i<cat.length;i++){
    if (cat[i].checked) decks.push(cat[i].value);
  }

  socket.emit('setDecks', decks);
}

socket.on('recieveCategories', function(cat){
  decks=cat;
  for (let i=0;i<cat.length;i++){
    let msg = document.createElement("a");
   //msg.className="userid";
    //msg.setAttribute("style", "color: "+cat[i].color);
    msg.innerHTML = "<input type=\"checkbox\" class=\"deck\" value=\""+cat[i].id+"\" checked=\"true\"><label for=\""+cat[i].id+"\">"+cat[i].name+"</label><br>";
    document.getElementById("catplace").appendChild(msg);
  }
});
socket.on('loadloader', function(number) {
  let msg = document.createElement("div");
  msg.className="loaderWrapper";
  msg.innerHTML = "<div class=\"wrapper\"><div class=\"dot dot1\"></div><div class=\"dot dot2\"></div><div class=\"dot dot3\"></div><div class=\"dot dot4\"></div><div class=\"dot dot5\"></div><div class=\"dot dot6\"></div><div class=\"dot dot7\"></div><div class=\"dot dot8\"></div><div class=\"dot dot9\"></div><div class=\"dot dot10\"></div><div class=\"dot dot11\"></div></div>"
  document.getElementById("yourCards").appendChild(msg);
});
socket.on('unloadloader', function(number) {
  let node = document.getElementById('yourCards');
  node.innerHTML = "";
});
socket.on('pointsToWin', function(number) {
  document.getElementById("pointsInput").value = number;
});
socket.on('pointsDisable', function() {
  document.getElementById("pointsButton").disabled=true;
  document.getElementById("deckButton").disabled=true;
});
socket.on('pointsEnable', function() {
  document.getElementById("pointsButton").disabled=false;
  document.getElementById("deckButton").disabled=false;
});
socket.on('startDisable', function() {
  document.getElementById("startButton").disabled=true;
});
socket.on('startEnable', function() {
  document.getElementById("startButton").disabled=false;
});
socket.on('message', function(message) {
  //console.log(message.author, message.sauce);
  displayMessage(message);
});
socket.on('privateMessage', function(id, message) {
  //console.log(message.author, message.sauce);
  if (id!=socketid) return;
  displayMessage(message);
});
socket.on('updateWhite', function(id){
    if (socketid!=id) return;
    updateWhite();
});

function writeCustom(){
    let text = document.getElementById('customInput').value;
    socket.emit("writeCustom", text);
}
function reroll(){
    socket.emit('reroll');
}
function vote(){
    socket.emit('vote');
}

socket.on('playedCards', function(playedCards, type) {
  allCards = playedCards;

  let node = document.getElementById('cards');
  node.innerHTML = "";

  //console.log(type);

  if (type==0){
      for (let id in playedCards){
        let msg = document.createElement("div");
        msg.className="biggerCard";
        msg.setAttribute("onClick", "tzarPicked("+playedCards[id].matchid+")");
        msg.innerHTML = playedCards[id].card.text;//+" ["+playedCards[id].matchid+"]";
        //msg.setAttribute("style", "background-color: "+playedCards[id].card.color);

        if (playedCards[id].card.type==1){
          msg.innerHTML = "";
          msg.setAttribute("style", "background-image: url("+playedCards[id].card.text+")")
        }

        document.getElementById("cards").appendChild(msg);
      }
  } else if (type==2 || type==3){
        insertionSort(allCards);
        let boxid = 0;
        let box;
        for (let id=0;id<allCards.length;id++){
        //console.log(allCards[id].player, allCards[id])
            if(id==0 || allCards[id].player!=allCards[id-1].player){
                 box = document.createElement("div");
                 box.className="box";
                 box.id=boxid;
                 document.getElementById("cards").appendChild(box);
                 boxid++;
            }
                let msg = document.createElement("div");
                msg.className="biggerCard";
                msg.setAttribute("onClick", "tzarPicked("+playedCards[id].matchid+")");
                //msg.setAttribute("style", "background-color: "+playedCards[id].card.color);
                msg.innerHTML = playedCards[id].card.text;//+" ["+playedCards[id].matchid+"]";
                if (playedCards[id].card.type==1){
                  msg.innerHTML = "";
                  msg.setAttribute("style", "background-image: url("+playedCards[id].card.text+")")
                }
                document.getElementById(boxid-1).appendChild(msg);
        }
  }
});
socket.on('playedCardsHidden', function() {
    let msg = document.createElement("div");
    msg.className="biggerCard hidden";

    document.getElementById("cards").appendChild(msg);
});
socket.on('tzarTurn', function(tzar) {
       //console.log(tzar.id, socketid)
       let info = document.createElement("h2");
       if (tzar.id==socketid) {
           // you are the tzar
           info.innerHTML = "You are the tzar, pick a card";
       } else {
           // your are not the tzar
           info.innerHTML = "Tzar is picking a card";
       }

       let msg = document.createElement("div");
       msg.appendChild(info);
       msg.id = "blocker"
       document.getElementById("yourCards").appendChild(msg);
   });
socket.on('blockTzar', function(tzarid) {
     if (tzarid!=socketid) return;
     let info = document.createElement("h2");

     info.innerHTML = "You are the tzar";

     let msg = document.createElement("div");
     msg.appendChild(info);
     msg.id = "blocker"
     document.getElementById("yourCards").appendChild(msg);
});
socket.on('enableCards', function() {
    let node = document.getElementById('blocker');
    node.parentNode.removeChild(node);
});
socket.on('cardPodiumAndPoints', function() {
  let node = document.getElementById('cards');
  node.innerHTML = "";
});
socket.on('recieveWhite', function(id, card, cardSauce) {
  if (socketid!=id) return;
  //console.log("WHITE RECIEVED", card, card.cardid, card.matchid)
  if(cardSauce.type==2) {
    let message = {
      date: '',
      author: "Customowa karta",
      sauce: '<div class="info_chat_input"><input id="customInput" placeholder="Tu wpisz tekst" aria-label="Tu wpisz tekst"><button type="button" onclick="writeCustom()">Send</button></div>'
    }
    displayMessage(message);
  }
  whiteCards.push({
    card: card,
    sauce: cardSauce
  });
  let message = {
    date: '',
    author: "white card",
    sauce: "["+card.matchid+"] "+cardSauce.text
  }
  displayMessage(message);

  updateWhite();
});
socket.on('deleteWhite', function(id){
  if(socketid!=id) return;
  //console.log(socketid, id);
  let node = document.getElementById('yourCards');
  node.innerHTML = "";
  whiteCards.splice(0, whiteCards.length);
});
socket.on('clearBoard', function(){
  let node = document.getElementById('yourCards');
  node.innerHTML = "";
  whiteCards.splice(0, whiteCards.length);
});
socket.on('blackCard', function(card) {
  blackType = card.type;

  let node = document.getElementById('blackCard');
  node.innerHTML = "";

  let msg = document.createElement("div");
  msg.className = "biggerCard blackCard";
  msg.innerHTML = card.text;
  document.getElementById("blackCard").appendChild(msg);
});
socket.on('highlightCard', function(cardid, players){
  let node = document.getElementById('cards');
  node.innerHTML = "";
//console.log(cardid);
    if (blackType==0){
          for (let id in allCards){
            let msg = document.createElement("div");
            msg.className="biggerCard";
            msg.setAttribute("style", "opacity: 0.5;");
           // msg.setAttribute("style", "background-color: "+allCards[id].card.color);
              if (allCards[id].card.type==0 || allCards[id].card.type==2){
                msg.innerHTML = allCards[id].card.text+" ["+players[allCards[id].player].name+"]";
                if (allCards[id].matchid==cardid) msg.setAttribute("style", "opacity: 1;");
              } else if (allCards[id].card.type==1){
                msg.innerHTML = "["+players[allCards[id].player].name+"]";
                if (allCards[id].matchid==cardid) msg.setAttribute("style", "opacity: 1; background-image: url("+allCards[id].card.text+")")
                else msg.setAttribute("style", "opacity: 0.5; background-image: url("+allCards[id].card.text+")")
              }
              document.getElementById("cards").appendChild(msg);
          }
    } else if (blackType==2 || blackType==3){
          let boxid = 0;
          let box;
          let winningPlayer ="";
          for (let id=0;id<allCards.length;id++){
            if(allCards[id].matchid==cardid) winningPlayer=allCards[id].player;
          }
          for (let id=0;id<allCards.length;id++){
              if(id==0 || allCards[id].player!=allCards[id-1].player){
                   box = document.createElement("div");
                   box.className="box";
                   box.id=boxid;
                   document.getElementById("cards").appendChild(box);
                   boxid++;
              }
                  let msg = document.createElement("div");
                  msg.className="biggerCard";
                  msg.setAttribute("style", "opacity: 0.5;")
                  //msg.setAttribute("style", "background-color: "+allCards[id].card.color);

                  if (allCards[id].card.type==0 || allCards[id].card.type==2){
                        msg.innerHTML = allCards[id].card.text+" ["+players[allCards[id].player].name+"]";
                        if (allCards[id].player==winningPlayer) msg.setAttribute("style", "opacity: 1;");
                  } else if (allCards[id].card.type==1){
                        msg.innerHTML = "["+players[allCards[id].player].name+"]";
                        if (allCards[id].player==winningPlayer) msg.setAttribute("style", "opacity: 1; background-image: url("+allCards[id].card.text+")")
                        else msg.setAttribute("style", "opacity: 0.5; background-image: url("+allCards[id].card.text+")")
                  }
                  document.getElementById(boxid-1).appendChild(msg);
          }
    }
});
socket.on('recieveEvent', function(msg, elemid){
    document.getElementById(elemid).appendChild(msg);
});
socket.on('state', function(playerList, players) {
  var node = document.getElementById('scoreboard');
  node.innerHTML = "";

  for (let id in playerList){
    let p = players[playerList[id]];
    let status = "";
    let name = p.name;
    if (p.id==socketid) {
        acceptCards=p.pick;
        name+=" (you)";
    }
    if (p.tzar) status="tzar";
    else if (!p.played) status="playing...";

    let msg = document.createElement("div");
    msg.className = "playerScore";
    msg.innerHTML = "<div>"+name+" "+status+"</br>Points: "+p.points+"</div><div style=\"opacity: 0.2\">"+"["+playerList[id]+"]"+"</div>";
    document.getElementById("scoreboard").appendChild(msg);
    document.getElementById("scoreboard").appendChild(document.createElement("hr"));
  }
});

function writeMessage(){
  let date = new Date();
  let input = {
    date: "["+String(date.getHours()).padStart(2,"0")+":"
    +String(date.getMinutes()).padStart(2,"0")+":"
    +String(date.getSeconds()).padStart(2,"0")+"]",
    author: nickname,
    sauce: document.getElementById("chatInput").value
  }
  socket.emit('message', input);
  document.getElementById("chatInput").value="";
  //displayMessage(input);
}

function displayMessage(message){
  var msg = document.createElement("p");
  msg.innerHTML = message.date+" "+message.author+": "+message.sauce;
  document.getElementById("chatLog").appendChild(msg);
  updateScroll();
  //console.log(input);
}

function insertionSort(inputArr) {
    let n = inputArr.length;
        for (let i = 1; i < n; i++) {
            // Choosing the first element in our unsorted subarray
            let current = inputArr[i];
            // The last element of our sorted subarray
            let j = i-1;
            while ((j > -1) && (current.player < inputArr[j].player)) {
                inputArr[j+1] = inputArr[j];
                j--;
            }
            inputArr[j+1] = current;
        }
    return inputArr;
}

function updateWhite(){
    let node = document.getElementById('yourCards');
     node.innerHTML = "";

     for (let id in whiteCards){
       let p = whiteCards[id];

       let msg = document.createElement("div");
       msg.className="card";
       //msg.setAttribute("style", "background-color: "+p.sauce.color);
       msg.setAttribute("onClick", "cardCommited("+p.card.matchid+", "+p.sauce.id+")");

       if (p.sauce.type==0 || p.sauce.type==2){
         msg.innerHTML = p.sauce.text+" ["+p.card.matchid+"]";
       } else if (p.sauce.type==1){
         msg.setAttribute("style", "background-image: url("+p.sauce.text+")")
       }
       document.getElementById("yourCards").appendChild(msg);
     }
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function checkCookie() {
  var username = getCookie("username");
  if (username != "") {
   //alert("Welcome again " + username);
   socket.emit('updateName', username);
   nickname = username;
  } else {
    username = prompt("Please enter your nickname", "");
    socket.emit('updateName', username);
    if (username != "" && username != null && username!=undefined) {
        setCookie("username", username, 1);
    }
  }
}
