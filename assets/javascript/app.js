// initialize firebase
var config = {
  apiKey: "AIzaSyD7uldkxKIeqbnQS_8mnIfSbr6WYxbc8pE",
  authDomain: "rps-multiplayer-138d6.firebaseapp.com",
  databaseURL: "https://rps-multiplayer-138d6.firebaseio.com",
  projectId: "rps-multiplayer-138d6",
  storageBucket: "rps-multiplayer-138d6.appspot.com",
  messagingSenderId: "163949376502"
};
firebase.initializeApp(config);

// database variable
var database = firebase.database();
var playerNum = 2;
var playerOne = "false";
var playerTwo = "false";
var winCounter = 0;
var loseCounter = 0;
var playerTurn = 1;
var playerName
// database listener for values and player status
database.ref("/players/").on("value", function (snapshot) {

  event.preventDefault();

  $("#reset").hide();

  if (snapshot.child("playerOne").exists()) {

    playerOne = snapshot.val().playerOne;
    $("#player1-name").text(playerOne.name);
    $("#p1-wins").text("Wins: " + playerOne.win);
    $("#p1-losses").text("Losses: " + playerOne.loss);

  }
  else {
    console.log("no players")
    $("#player1-name").text("waiting for Player One")
    $("#p1-wins").text("Wins: ")
    $("#p1-losses").text("Losses: ")
  }
  if (snapshot.child("playerTwo").exists()) {

    playerTwo = snapshot.val().playerTwo;
    $("#player2-name").text(playerTwo.name);
    $("#p2-wins").text("Wins: " + playerTwo.win);
    $("#p2-losses").text("Losses: " + playerTwo.loss)
  }
  else {
    console.log("player two does not exist")
    $("#player2-name").text("waiting for Player Two")
    $("#p1-wins").text("Wins: ")
    $("#p1-losses").text("Losses: ")
  }

  if (!playerOne && !playerTwo) {
    database.ref("/chat/").remove();
    database.ref("/turn/").remove();
    database.ref("/outcome/").remove();

    $("#chatlog").empty();
  }
});

// Database listener for player disconnections 

database.ref("/players/").on("child_removed", function (snapshot) {
  var msg = snapshot.val().name + " has disconnected!";

  // Get a key for the disconnection chat entry
  var chatKey = database.ref().child("/chat/").push().key;

  // Save the disconnection chat entry
  database.ref("/chat/" + chatKey).set(msg);
});



// chat message database listener
database.ref("/chat/").on("child_added", function (snapshot) {
  var chatMsg = snapshot.val();
  var chatEntry = $("<div>").html(chatMsg);

  $("#chatlog").append(chatEntry);
  $("#chatlog").scrollTop($("#chatlog")[0].scrollHeight);
});



// listens for each turn
database.ref("/turn/").on("value", function (snapshot) {
  // Check if it's player1's turn
  if (snapshot.val() === 1) {
    console.log("TURN 1");
    playerTurn = 1;
    $("#reset").hide();

    if (playerOne && playerTwo) {
      $("#game-state-header").html("Waiting on " + playerOne.name + " to choose!");
    }
  } else if (snapshot.val() === 2) {
    console.log("TURN 2");
    playerTurn = 2;
    $("#reset").hide();

    if (playerOne && playerTwo) {
      $("#game-state-header").html("Waiting on " + playerTwo.name + " to choose!");
    }
  }
  else if (snapshot.val() === 3) {
    console.log("turn 3");
    playerTurn = 3
    $("reset").show();

  }
});
// listener for game outcome
database.ref("/outcome/").on("value", function (snapshot) {
  event.preventDefault();
  $("#game-state-header").text(snapshot.val());
  $("#player1-selected").text(playerOne.choice);
  $("#player2-selected").text(playerTwo.choice);
});

// create listener for button values store them into firebase

$("#name-button").on("click", function () {
  playerConstructor();
});

$(".rps-selector").on("click", function () {

  if (playerOne && playerTwo && (playerName === playerOne.name) && (playerTurn === 1)) {

    playerOne.choice = $(this).val();
    database.ref().child("/players/playerOne/choice").set(playerOne.choice);
    console.log(playerOne.choice);
    playerTurn = 2;
    database.ref().child("/turn").set(2);

  }
  else if (playerOne && playerTwo && (playerName === playerTwo.name) && (playerTurn === 2)) {

    playerTwo.choice = $(this).val();
    database.ref().child("/players/playerTwo/choice").set(playerTwo.choice);
    console.log(playerTwo.choice);
    playerTurn = 3;
    database.ref().child("/turn").set(3);
  }

  if (playerTurn === 3) {

    choiceCompare();
    $("#reset").show();
  }

});


$("#chat-send").on("click", function (event) {
  event.preventDefault();

  if ((playerName !== "") && ($("#chat-input").val().trim() !== "")) {
    // Grab the message from the input box and reset the input box
    var msg = playerName + ": " + $("#chat-input").val().trim();
    $("#chat-input").val("");

    // Get a key for the new chat entry
    var chatKey = database.ref().child("/chat/").push().key;

    // Save the new chat entry
    database.ref("/chat/" + chatKey).set(msg);
  }
});

$("#reset").on("click", function () {
  Reset();
});

$("chat-send").on("click", function(event) {
  
  event.preventDefault();
  chatFunc();

});
// FUNCTIONS!!!!
function playerConstructor() {

  playerName = $("#name-input").val().trim();
  // if statement to see which player you are
  if (playerOne === "false") {
    playerOne = {
      name: playerName,
      win: 0,
      loss: 0,
      tie: 0,
      choice: "blank"
    };
    alert("you are Player One");
    database.ref().child("/players/playerOne").set(playerOne);
    database.ref().child("/turn").set(1);
    database.ref("/players/playerOne").onDisconnect().remove();
  }
  else {
    playerTwo = {
      name: playerName,
      win: 0,
      loss: 0,
      tie: 0,
      choice: "blank"
    };
    alert("you are Player Two");
    database.ref().child("/players/playerTwo").set(playerTwo);
    database.ref("/players/playerTwo").onDisconnect().remove();
  }
  console.log(playerName);
  console.log(playerOne);
  console.log(playerTwo);

  var msg = playerName + " has joined!";
  console.log(msg);

  // Get a key for the join chat entry
  var chatKey = database.ref().child("/chat/").push().key;

  // Save the join chat entry
  database.ref("/chat/" + chatKey).set(msg);

};

function choiceCompare() {
  if (playerOne.choice === "Rock") {
    if (playerTwo.choice === "Rock") {
      // Tie
      console.log("tie");

      database.ref().child("/outcome/").set("Tie game!");
      database.ref().child("/players/playerOne/tie").set(playerOne.tie + 1);
      database.ref().child("/players/playerTwo/tie").set(playerTwo.tie + 1);
    } else if (playerTwo.choice === "Paper") {
      // PlayerTwo wins
      console.log("paper wins");

      database.ref().child("/outcome/").set(playerTwo.name + " wins!");
      database.ref().child("/players/playerOne/loss").set(playerOne.loss + 1);
      database.ref().child("/players/playerTwo/win").set(playerTwo.win + 1);
    } else { // scissors
      // PlayerOne wins
      console.log("rock wins");

      database.ref().child("/outcome/").set(playerOne.name + " wins!");
      database.ref().child("/players/playerOne/win").set(playerOne.win + 1);
      database.ref().child("/players/playerTwo/loss").set(playerTwo.loss + 1);
    }

  } else if (playerOne.choice === "Paper") {
    if (playerTwo.choice === "Rock") {
      // PlayerOne wins
      console.log("paper wins");

      database.ref().child("/outcome/").set(playerOne.name + " wins!");
      database.ref().child("/players/playerOne/win").set(playerOne.win + 1);
      database.ref().child("/players/playerTwo/loss").set(playerTwo.loss + 1);
    } else if (playerTwo.choice === "Paper") {
      // Tie
      console.log("tie");

      database.ref().child("/outcome/").set("Tie game!");
      database.ref().child("/players/playerOne/tie").set(playerOne.tie + 1);
      database.ref().child("/players/playerTwo/tie").set(playerTwo.tie + 1);
    } else { // Scissors
      // PlayerTwo wins
      console.log("scissors win");

      database.ref().child("/outcome/").set(playerTwo.name + " wins!");
      database.ref().child("/players/playerOne/loss").set(playerOne.loss + 1);
      database.ref().child("/players/playerTwo/win").set(playerTwo.win + 1);
    }

  } else if (playerOne.choice === "Scissors") {
    if (playerTwo.choice === "Rock") {
      // PlayerTwo wins
      console.log("rock wins");

      database.ref().child("/outcome/").set(playerTwo.name + " wins!");
      database.ref().child("/players/playerOne/loss").set(playerOne.loss + 1);
      database.ref().child("/players/playerTwo/win").set(playerTwo.win + 1);
    } else if (playerTwo.choice === "Paper") {
      // PlayerOne wins
      console.log("scissors win");

      database.ref().child("/outcome/").set(playerOne.name + " wins!");
      database.ref().child("/players/playerOne/win").set(playerOne.win + 1);
      database.ref().child("/players/playerTwo/loss").set(playerTwo.loss + 1);
    } else {
      // Tie
      console.log("tie");

      database.ref().child("/outcome/").set("Tie game!");
      database.ref().child("/players/playerOne/tie").set(playerOne.tie + 1);
      database.ref().child("/players/playerTwo/tie").set(playerTwo.tie + 1);
      $("#game-state-header").text("Tie Game!")
    }

  }
};

function Reset() {
  database.ref().child("/players/playerOne/choice").remove();
  database.ref().child("/players/playerTwo/choice").remove();
  playerTurn = 1;
  database.ref().child("/turn").set(1);
  database.ref().child("/outcome").remove();
  $("reset").hide();
};

function chatFunc() {

  event.preventDefault();

  // get message and append to firebase
  database.ref("/chat/").set({ message: $("#chat-input").val() })

  $("#chat-input").val("");

  database.ref("/chat/").on("value", function (snapshot) {

    $("#chatlog").append(snapshot.val().message + "\n");

  });
}