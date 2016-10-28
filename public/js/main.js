function deckbuilder() {
  var opts = ['0','1','2'];
  var deck = [];
  for (var a=0;a<3;a++) {
    for (var b=0;b<3;b++) {
      for (var c=0;c<3;c++) {
        for (var d=0;d<3;d++) {
          deck.push(opts[a]+opts[b]+opts[c]+opts[d]);
        }
      }
    }
  }
  return deck;
}

function testSet(cards) {
  for (var i=0;i<4;i++) {
    var to_test = parseInt(cards[0][i])+parseInt(cards[1][i])+parseInt(cards[2][i]);
    if (to_test % 3 != 0) {
    return false;
    }
  }
  return true;
}

function dealCards(deck, n) {
  var result = [];
  for (var i=0;i<n;i++) {
    result.push(deck.pop());
  }
  return result;
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// Old Search method - just keep on guessing forever

// Function returns array like Python's range(int) method
function jrange(board) {
  var a = [];
  for (var i=0;i<12;i++) {
    a.push(i);
  }
  return a;
}

function nameThird(cards) {
  var features;
  var missing;
  var result = "";
  for (var i=0;i<4;i++) {
    if (cards[0][i] == cards[1][i]) {
      result = result + cards[0][i]
    } else {
      features = parseInt(cards[0][i])+parseInt(cards[1][i])
      missing = (3 - features).toString();
      result = result + missing;
    }
  }
  return result.trim();
}

function computerGuess(board) {
  var chosen = shuffle(jrange(board));
  var a = board[chosen[0]]
  var b = board[chosen[1]]
  var c = nameThird([a,b]);
  if (board.indexOf(c) != -1) {
    return [a,b,c];
  }
  return false;
}

// End old method

var app = angular.module('SetGame', [], function($interpolateProvider) {
  $interpolateProvider.startSymbol('<%');
  $interpolateProvider.endSymbol('%>')
});

app.controller('MainController', ['$timeout', '$interval' ,function($timeout, $interval) {
  $game = this;
  this.started = false;
  this.message = "SET";
  this.deck = deckbuilder();
  this.board = dealCards(this.deck, 12);
  this.selected = [];
  this.yourScore = 0;
  this.opponentScore = 0;
  this.touch = function(card) {
    var cardIndex = $game.selected.indexOf(card)
    if (cardIndex != -1) {
      $game.selected.splice(cardIndex,1);
    }
    else { $game.selected.push(card) };
    $timeout($game.checkSet, 300);
  }
  this.checkSet = function() {
    if ($game.selected.length == 3) {
      if (testSet($game.selected)) {
        $game.yourScore += 1;
        $game.removeSet($game.selected);
      }
    $game.selected = [];
    }
  };
  this.removeSet = function(cards) {
    for (var i=0;i < cards.length;i++) {
      var index = $game.board.indexOf(cards[i]);
      $game.board[index] = $game.deck.pop();
    };
    $game.selected = [];
  }
  this.getClasses = function(card) {
    var classes = [];
    var numbers = {"0":"one",
                   "1":"two",
                   "2":"three"};
    var fill = {"0":"empty",
                "1":"striped",
                "2":"solid"};
    classes.push(numbers[card[2]]);
    classes.push(fill[card[3]]);
    return classes.join(" ");
  };
  this.guess = function() {
    console.log('Guess!');
    var result = computerGuess($game.board);
    if (result) {
      $game.opponentScore += 1;
      $game.removeSet(result);
    }
  };
  this.startGame = function() {
    $interval($game.guess, 800);
  };
}]);
