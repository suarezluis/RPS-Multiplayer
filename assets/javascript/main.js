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
  ready:true
};

// Check if database structure exists, if not create it
rpsMultiPlayerRef.once("value", function(snap) {
  
  if (snap.hasChild("playerOne") == false) {
    rpsMultiPlayerRef.child("playerOne").set(player);
  }
  if (snap.hasChild("playerTwo") == false) {
    rpsMultiPlayerRef.child("playerTwo").set(player);
  }
});

rpsMultiPlayerRef.onDisconnect().update({playerOne:player, playerTwo:player})

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





//========================main===============================

rpsMultiPlayerRef.child("chat").on("child_added", function(snap, key){$(".chatDisplay").append("" + snap.val()+"<br>");$(".chatDisplay").animate({ scrollTop: $(document).height() }, "slow");
return false;})


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
      "The arena is full, please wait untill the Game is Over and enjoy the match"
    );
  } else {
    $(".enterGame").html(
      '<form class="nameForm" action=""><input class="nameInput" type="text" placeholder="Gladiator" required><input class="nameSubmit" type="submit" value="Enter the Arena"></form>'
    );
  }
  //Listen for click on enter the arena
  $(".nameSubmit").on("click", function(e) {
    e.preventDefault();

    name = $(".nameInput").val();
    


    
    if (name != "") {
    
    //activate chat
        $(".chatSubmit").on("click",function(){rpsMultiPlayerRef.child("chat").push(""+name+": "+$(".chatInput").val());$(".chatInput").val("")})

        if (playerOneConnected) {
        iAm = "Two";
        heIs = "One";
      } else {
        iAm = "One";
        heIs = "Two";
      }
      $(".nameInput").val("");

      playerUpdate(iAm, "name", name);
      playerUpdate(iAm, "connected", true);
    } else alert("Do you have a name, son?");
  });

  if (playerOneConnected && playerTwoConnected && pick == "" && snap.child("playerOne").val().ready && snap.child("playerTwo").val().ready) {
    again = false
    $(".player" + iAm + "Moves").html(
      "<button class='option' value='RoCk!'>RoCk!</button><button class='option' value='PaPeR!'>PaPeR!</button><button class='option' value='ScIsSoRs!'>ScIsSoRs!</button>"
    );
    
    $(".textResults").text("Pick Your Move...");
    $(".option").on("click", function() {
        playerUpdate(iAm,"ready",false);
      $(".textResults").text("Waiting on your oponent...");
      $(".player" + iAm + "Moves").text(
        "You shot: " + $(this).text()
      );
      pick = $(this).val();
      playerUpdate(iAm, "shot", pick);
      $(".option").off();
      playerUpdate(iAm, "picked", true);
    });
  }
  if (playerOnePicked && playerTwoPicked && snap.child("player" + iAm).val().end == false) {
    playerUpdate(iAm,"end", true);
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
      
      playerUpdate(iAm,"played",played);
      playerUpdate(iAm,"won",won);
      playerUpdate(iAm,"lost",lost);
      playerUpdate(iAm,"tie",tie);
      
      
      $(".vsArea").append("<button class='playAgain'>Play Again</button>")
      
    }, 5000);
  }

  if(name != ""){
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

  
  $(".playAgain").on("click", function(){
    $(".playAgain").off()
    pick = "";
    $(".textResults").text("Waiting on your oponent...");
    rpsMultiPlayerRef.child("player"+iAm).set({
        connected: true,
        name: name,
        picked: false,
        shot: "",
        played: played,
        won: won,
        lost: lost,
        tie: tie,
        end: false,
        ready:true
      });

      rpsMultiPlayerRef.child("player"+heIs).set({
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
      
      
  })

}

});
