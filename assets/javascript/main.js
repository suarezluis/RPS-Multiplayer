/*
 ╔═════════════ஜ۩۞۩ஜ══════════════╗
     Programmed by: by Luis Suarez    
 ╚═════════════ஜ۩۞۩ஜ══════════════╝
*/

// Initialize Firebase
var config = {
  apiKey: "AIzaSyCMZUFGTi5fg3qB0x-uDAPvruRRbMyixG0",
  authDomain: "ut-codingcamp-45ac0.firebaseapp.com",
  databaseURL: "https://ut-codingcamp-45ac0.firebaseio.com",
  projectId: "ut-codingcamp-45ac0",
  storageBucket: "ut-codingcamp-45ac0.appspot.com",
  messagingSenderId: "955060422974"
};
firebase.initializeApp(config);

/***
 *
 *
 *    oooo    ooo  .oooo.   oooo d8b  .oooo.o
 *     `88.  .8'  `P  )88b  `888""8P d88(  "8
 *      `88..8'    .oP"888   888     `"Y88b.
 *       `888'    d8(  888   888     o.  )88b
 *        `8'     `Y888""8o d888b    8""888P'
 *
 *
 *
 */

var database = firebase.database();
var rpsMultiPlayerRef = database.ref("/RPS-MultiPlayer");
var myNumber = 0;
var name = "";
var playerOneConnected;
var playerTwoConnected;
var iAm;
var heIs;
var he;
var me;
var pick = "";
var played = 0;
var won = 0;
var lost = 0;
var tie = 0;

// declaration of player object
var player = {
  connected: false,
  name: "",
  picked: false,
  shot: "",
  played: 0,
  won: 0,
  lost: 0,
  tie: 0,
  end: false,
  ready: true
};

$(".emergencyButton").on("click", function(){
  reset()
})


console.log("%cLuis Suarez: If you encounter any problems please reset the data base by typing reset() here in the console","color:red; background-color: yellow; font-size:20px;")

// Check if database structure exists, if not create it
rpsMultiPlayerRef.once("value", function(snap) {
  if (snap.hasChild("playerOne") == false) {
    rpsMultiPlayerRef.child("playerOne").set(player);
  }
  if (snap.hasChild("playerTwo") == false) {
    rpsMultiPlayerRef.child("playerTwo").set(player);
  }
});


//                                           .     .o o.   
//                                         .o8    .8' `8.  
// oooo d8b  .ooooo.   .oooo.o  .ooooo.  .o888oo .8'   `8. 
// `888""8P d88' `88b d88(  "8 d88' `88b   888   88     88 
//  888     888ooo888 `"Y88b.  888ooo888   888   88     88 
//  888     888    .o o.  )88b 888    .o   888 . `8.   .8' 
// d888b    `Y8bod8P' 8""888P' `Y8bod8P'   "888"  `8. .8'  
//                                                 `" "'   
                                                        
                                                        

function reset(){
  rpsMultiPlayerRef.child("playerOne").set(player);
  rpsMultiPlayerRef.child("playerTwo").set(player);
  window.location.reload()
}



/***
 *               oooo                                           ooooo     ooo                  .o8                .               .o o.
 *               `888                                           `888'     `8'                 "888              .o8              .8' `8.
 *    oo.ooooo.   888   .oooo.   oooo    ooo  .ooooo.  oooo d8b  888       8  oo.ooooo.   .oooo888   .oooo.   .o888oo  .ooooo.  .8'   `8.
 *     888' `88b  888  `P  )88b   `88.  .8'  d88' `88b `888""8P  888       8   888' `88b d88' `888  `P  )88b    888   d88' `88b 88     88
 *     888   888  888   .oP"888    `88..8'   888ooo888  888      888       8   888   888 888   888   .oP"888    888   888ooo888 88     88
 *     888   888  888  d8(  888     `888'    888    .o  888      `88.    .8'   888   888 888   888  d8(  888    888 . 888    .o `8.   .8'
 *     888bod8P' o888o `Y888""8o     .8'     `Y8bod8P' d888b       `YbodP'     888bod8P' `Y8bod88P" `Y888""8o   "888" `Y8bod8P'  `8. .8'
 *     888                       .o..P'                                        888                                                `" "'
 *    o888o                      `Y8P'                                        o888o
 *
 */
// Function that updates player items with player number as "One" or "Two", itemToUpdate as a string
function playerUpdate(playerNumber, itemToUpdate, valueToUpdate) {
  var playerID;

  if (playerNumber == "One") {
    playerID = "playerOne";
  }
  if (playerNumber == "Two") {
    playerID = "playerTwo";
  }
  rpsMultiPlayerRef.child(playerID).once("value", function(snap) {
    var object = snap.val();
    object[itemToUpdate] = valueToUpdate;

    rpsMultiPlayerRef.child(playerID).set(object);
  });
}

/***
 *                                 o8o                .o o.
 *                                 `"'               .8' `8.
 *    ooo. .oo.  .oo.    .oooo.   oooo  ooo. .oo.   .8'   `8.
 *    `888P"Y88bP"Y88b  `P  )88b  `888  `888P"Y88b  88     88
 *     888   888   888   .oP"888   888   888   888  88     88
 *     888   888   888  d8(  888   888   888   888  `8.   .8'
 *    o888o o888o o888o `Y888""8o o888o o888o o888o  `8. .8'
 *                                                    `" "'
 *
 *
 */
//========================main===============================

rpsMultiPlayerRef.child("chat").on("child_added", function(snap, key) {
  $(".chatDisplay").append("" + snap.val() + "<br>");
  $(".chatDisplay").animate({ scrollTop: $(document).height() }, "slow");
  return false;
});

rpsMultiPlayerRef.on("value", function(snap) {
  playerOneConnected = snap.child("playerOne").val().connected;
  playerTwoConnected = snap.child("playerTwo").val().connected;
  playerOnePicked = snap.child("playerOne").val().picked;
  playerTwoPicked = snap.child("playerTwo").val().picked;
  //check if player one is connected and update html
  if (playerOneConnected) {
    $(".playerOneArea").html(
      snap.child("playerOne").val().name + " is connected"
    );
  } else {
    $(".playerOneArea").html("Waiting for Player One");
  }
  //check if player two is connected and update html
  if (snap.child("playerTwo").val().connected) {
    $(".playerTwoArea").html(
      snap.child("playerTwo").val().name + " is connected"
    );
  } else {
    $(".playerTwoArea").html("Waiting for Player Two");
  }
  //check if player one + player two is connected and update html
  if (playerOneConnected && playerTwoConnected) {
    $(".enterGame").html(
      "The arena is full, please wait untill the Game is Over"
    );
  } else {
    $(".enterGame").html(
      '<form class="nameForm" action=""><input class="nameInput" type="text" placeholder="Gladiator" required><input class="nameSubmit" type="submit" value="Enter the Arena"></form>'
    );
  }

  /***
   *                                .o           oooo   o8o            oooo        o.
   *                               .8'           `888   `"'            `888        `8.
   *     .ooooo.  ooo. .oo.       .8'   .ooooo.   888  oooo   .ooooo.   888  oooo   `8.
   *    d88' `88b `888P"Y88b      88   d88' `"Y8  888  `888  d88' `"Y8  888 .8P'     88
   *    888   888  888   888      88   888        888   888  888        888888.      88
   *    888   888  888   888  .o. `8.  888   .o8  888   888  888   .o8  888 `88b.   .8'
   *    `Y8bod8P' o888o o888o Y8P  `8. `Y8bod8P' o888o o888o `Y8bod8P' o888o o888o .8'
   *                                `"                                             "'
   *
   *
   */

  //Listen for click on enter the arena
  $(".nameSubmit").on("click", function(e) {
    e.preventDefault();

    name = $(".nameInput").val();

    if (name != "") {
      //activate chat
      $(".chatSubmit").on("click", function() {
        rpsMultiPlayerRef
          .child("chat")
          .push("" + name + ": " + $(".chatInput").val());
        $(".chatInput").val("");
      });

      if (playerOneConnected) {
        rpsMultiPlayerRef.onDisconnect().update({ playerTwo: player });
        iAm = "Two";
        heIs = "One";
      } else {
        rpsMultiPlayerRef.onDisconnect().update({ playerOne: player });
        iAm = "One";
        heIs = "Two";
      }
      $(".nameInput").val("");

      playerUpdate(iAm, "name", name);
      playerUpdate(iAm, "connected", true);
    } else alert("Do you have a name, son?");
  });

  if (
    playerOneConnected &&
    playerTwoConnected &&
    pick == "" &&
    snap.child("playerOne").val().ready &&
    snap.child("playerTwo").val().ready
  ) {
    again = false;
    $(".player" + iAm + "Moves").html(
      "<button class='option' value='RoCk!'>RoCk!</button><button class='option' value='PaPeR!'>PaPeR!</button><button class='option' value='ScIsSoRs!'>ScIsSoRs!</button>"
    );

    $(".textResults").text("Pick Your Move...");

    /***
     *                                .o           oooo   o8o            oooo        o.
     *                               .8'           `888   `"'            `888        `8.
     *     .ooooo.  ooo. .oo.       .8'   .ooooo.   888  oooo   .ooooo.   888  oooo   `8.
     *    d88' `88b `888P"Y88b      88   d88' `"Y8  888  `888  d88' `"Y8  888 .8P'     88
     *    888   888  888   888      88   888        888   888  888        888888.      88
     *    888   888  888   888  .o. `8.  888   .o8  888   888  888   .o8  888 `88b.   .8'
     *    `Y8bod8P' o888o o888o Y8P  `8. `Y8bod8P' o888o o888o `Y8bod8P' o888o o888o .8'
     *                                `"                                             "'
     *
     *
     */

    $(".option").on("click", function() {
      playerUpdate(iAm, "ready", false);
      $(".textResults").text("Waiting on your oponent...");
      $(".player" + iAm + "Moves").text("You shot: " + $(this).text());
      pick = $(this).val();
      playerUpdate(iAm, "shot", pick);
      $(".option").off();
      playerUpdate(iAm, "picked", true);
    });
  }
  if (
    playerOnePicked &&
    playerTwoPicked &&
    snap.child("player" + iAm).val().end == false
  ) {
    playerUpdate(iAm, "end", true);
    $(".vsArea").css("color", "red");
    $(".vsArea").text("READY!");
    $(".textResults").text("");
    setTimeout(function() {
      $(".textResults").css("color", "red");
      $(".textResults").append("<br>ROCK!");
    }, 1000);
    setTimeout(function() {
      $(".textResults").css("color", "black");
      $(".textResults").append("<br>PAPER!!");
    }, 2000);
    setTimeout(function() {
      $(".textResults").css("color", "red");
      $(".textResults").append("<br>SCISSORS!");
    }, 3000);
    setTimeout(function() {
      $(".textResults").css("color", "black");
      $(".textResults").append("<br>SHOOT!");
      $(".player" + heIs + "Moves").text(
        snap.child("player" + heIs).val().name +
          " shot: " +
          snap.child("player" + heIs).val().shot
      );
    }, 4000);
    setTimeout(function() {
      me = snap.child("player" + iAm).val().shot;
      he = snap.child("player" + heIs).val().shot;

      if (me == "RoCk!" && he == "RoCk!") {
        played++;
        tie++;
        $(".vsArea").html("Its a Tie!");
      }
      if (me == "RoCk!" && he == "PaPeR!") {
        played++;
        lost++;
        $(".vsArea").html("You Lost!");
      }
      if (me == "RoCk!" && he == "ScIsSoRs!") {
        played++;
        won++;
        $(".vsArea").html("You Won!");
      }
      if (me == "PaPeR!" && he == "RoCk!") {
        played++;
        won++;
        $(".vsArea").html("You Won!");
      }
      if (me == "PaPeR!" && he == "PaPeR!") {
        played++;
        tie++;
        $(".vsArea").html("Its a Tie!");
      }
      if (me == "PaPeR!" && he == "ScIsSoRs!") {
        played++;
        lost++;
        $(".vsArea").html("You Lost!");
      }
      if (me == "ScIsSoRs!" && he == "RoCk!") {
        played++;
        lost++;
        $(".vsArea").html("You Lost!");
      }
      if (me == "ScIsSoRs!" && he == "PaPeR!") {
        played++;
        won++;
        $(".vsArea").html("You Won!");
      }
      if (me == "ScIsSoRs!" && he == "ScIsSoRs!") {
        played++;
        tie++;
        $(".vsArea").html("Its a Tie!");
      }
      // Update player stats in database

      playerUpdate(iAm, "played", played);
      playerUpdate(iAm, "won", won);
      playerUpdate(iAm, "lost", lost);
      playerUpdate(iAm, "tie", tie);

      $(".vsArea").append("<button class='playAgain'>Play Again</button>");
    }, 5000);
  }

  if (name != "") {
    $(".player" + iAm + "Area").html(
      snap.child("player" + iAm).val().name +
        "<br>Games:" +
        played +
        "<br>Won:" +
        won +
        "<br>Lost:" +
        lost +
        "<br>Tie:" +
        tie
    );
    $(".player" + heIs + "Area").html(
      snap.child("player" + heIs).val().name +
        "<br>Games:" +
        snap.child("player" + heIs).val().played +
        "<br>Won:" +
        snap.child("player" + heIs).val().won +
        "<br>Lost:" +
        snap.child("player" + heIs).val().lost +
        "<br>Tie:" +
        snap.child("player" + heIs).val().tie
    );

    /***
     *                                .o           oooo   o8o            oooo        o.
     *                               .8'           `888   `"'            `888        `8.
     *     .ooooo.  ooo. .oo.       .8'   .ooooo.   888  oooo   .ooooo.   888  oooo   `8.
     *    d88' `88b `888P"Y88b      88   d88' `"Y8  888  `888  d88' `"Y8  888 .8P'     88
     *    888   888  888   888      88   888        888   888  888        888888.      88
     *    888   888  888   888  .o. `8.  888   .o8  888   888  888   .o8  888 `88b.   .8'
     *    `Y8bod8P' o888o o888o Y8P  `8. `Y8bod8P' o888o o888o `Y8bod8P' o888o o888o .8'
     *                                `"                                             "'
     *
     *
     */

    $(".playAgain").on("click", function() {
      $(".playAgain").off();
      pick = "";
      $(".textResults").text("Waiting on your oponent...");
      rpsMultiPlayerRef.child("player" + iAm).set({
        connected: true,
        name: name,
        picked: false,
        shot: "",
        played: played,
        won: won,
        lost: lost,
        tie: tie,
        end: false,
        ready: true
      });

      rpsMultiPlayerRef.child("player" + heIs).set({
        connected: true,
        name: snap.child("player" + heIs).val().name,
        picked: false,
        shot: "",
        played: snap.child("player" + heIs).val().played,
        won: snap.child("player" + heIs).val().won,
        lost: snap.child("player" + heIs).val().lost,
        tie: snap.child("player" + heIs).val().tie,
        end: false,
        ready: snap.child("player" + heIs).val().ready
      });
    });
  }
});
