'use strict';
    //Initial x coordinate of all bugs. Highest speed of all bugs. Lowest speed of all bugs.
var BUG_INITIAL_X = -101,
    BUG_HIGH_SPEED = 150,
    BUG_LOW_SPEED = 50,
    //Interval for generating a new set of bugs and kill the oldest set of bugs.
    BUG_INTERVAL = 3000,
    //User's points, lives left, and success counts.
    score,
    life,
    success;

// Enemies our player must avoid
var Enemy = function() {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started
  this.row = Math.floor(Math.random() * 7 + 2);
  this.speed = Math.floor(Math.random() * (BUG_HIGH_SPEED - BUG_LOW_SPEED + 1) + BUG_LOW_SPEED);
  this.x = BUG_INITIAL_X;
  this.y = (this.row - 1) * 83 - 73;
  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = 'images/enemy-bug.png';
  //The rectangle outline of the bug, not the bug image.
  this.rect = {x: (this.x + 1), y: (this.y + 77), width: 98, height: 66};
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  this.x += dt * this.speed;
  this.rect.x = this.x + 1;
  this.rect.y = this.y + 77;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Element is the parent class of Gem, Star, Heart, Key, and Rock. Player can interact with them.
var Element = function() {
  this.row = Math.floor(Math.random() * 6 + 2);
  this.col = Math.floor(Math.random() * 6 + 1);
  this.x = (this.col - 1) * 101 + 22;
  this.y = (this.row - 1) * 83 - 20;
  //Elements only exist for a while and then be replaced by a new one.
  this.duration = Math.floor(Math.random() * 100000 + 3000);
  this.start = Date.now();
  this.end = this.start + this.duration;
};

Element.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Check if player hits the element.
Element.prototype.checkElementCollision = function() {
  if (
    player.rect.x < this.rect.x + this.rect.width &&
    player.rect.x + player.rect.width > this.rect.x &&
    player.rect.y < this.rect.y + this.rect.height &&
    player.rect.y + player.rect.height > this.rect.y
  ) return true;
  return false;
};

//Update an element to a new position.
Element.prototype.replace = function() {
  this.row = Math.floor(Math.random() * 7 + 2);
  this.col = Math.floor(Math.random() * 6 + 1);
  this.x = (this.col - 1) * 101 + 22;
  this.y = (this.row - 1) * 83 - 20;
  this.duration = Math.floor(Math.random() * 60000 + 2000);
  this.start = Date.now();
  this.end = this.start + this.duration;
  while (this.checkDuplicatedPos()) {
    this.replace();
  }
};

Element.prototype.checkDuplicatedPos = function() {
  for (var i = 0, length = allElements.length; i < length; i++) {
    if (this !== allElements[i] && this.row === allElements[i].row && this.col === allElements[i].col) {
      return true;
    }
  }
  return false;
};

//Player can get 1 point when hitting a Gem.
var Gem = function() {
  Element.call(this);
  //The color of the gem is random.
  this.setColor();
  //The rectangle outline of the gem, not the gem image.
  this.rect = {x: (this.x + 2), y: (this.y + 34), width: 55, height: 61};
};

Gem.prototype = Object.create(Element.prototype);
Gem.prototype.constructor = Gem;

Gem.prototype.setColor = function() {
  this.color = Math.floor(Math.random() * 2 + 1);
  if (this.color === 1) this.sprite = 'images/gem-blue-small.png';
  if (this.color === 2) this.sprite = 'images/gem-green-small.png';
  if (this.color === 3) this.sprite = 'images/gem-orange-small.png';
};

//Replace a gem if it is outdated or hitted by the player.
Gem.prototype.update = function() {
  this.rect.x = this.x + 2;
  this.rect.y = this.y + 34;
  if (Date.now() > this.end) {
    this.replace();
    this.setColor();
  }
  if (this.checkElementCollision()) {
    //Player will get 1 point when hitting a gem.
    score++;
    updateScore();
    this.replace();
    this.setColor();
  }
};

//Player can get 5 points when hitting a Gem.
var Star = function() {
  Element.call(this);
  this.sprite = 'images/star-small.png';
  //The rectangle outline of the star, not the star image.
  this.rect = {x: (this.x + 2), y: (this.y + 32), width: 55, height: 55};
};

Star.prototype = Object.create(Element.prototype);
Star.prototype.constructor = Star;

//Replace the star if it is outdated or hitted by the player.
Star.prototype.update = function() {
  this.rect.x = this.x + 2;
  this.rect.y = this.y + 32;
  if (Date.now() > this.end) {
    this.replace();
  }
  //Player will get 5 points when hitting a star.
  if (this.checkElementCollision()) {
    score += 5;
    updateScore();
    this.replace();
  }
};

//Player can get 3 lives when hitting a Heart
var Heart = function() {
  Element.call(this);
  this.sprite = 'images/heart-small.png';
  //The rectangle outline of the heart, not the heart image.
  this.rect = {x: (this.x + 4), y: (this.y + 28), width: 52, height: 52};
};

Heart.prototype = Object.create(Element.prototype);
Heart.prototype.constructor = Heart;

//Replace the heart if it is outdated or hitted by the player.
Heart.prototype.update = function() {
  this.rect.x = this.x + 4;
  this.rect.y = this.y + 28;
  if (Date.now() > this.end) {
    this.replace();
  }
  //Player will get 3 lives when hitting a heart.
  if (this.checkElementCollision()) {
    life += 3;
    updateLife();
    this.replace();
  }
};

//Player can reach the water when hitting a Key.
var Key = function() {
  Element.call(this);
  this.sprite = 'images/key-small.png';
  //The rectangle outline of the key, not the key image.
  this.rect = {x: (this.x + 14), y: (this.y + 33), width: 30, height: 54};
};

Key.prototype = Object.create(Element.prototype);
Key.prototype.constructor = Key;

//Replace the key if it is outdated or hitted by the player.
Key.prototype.update = function() {
  this.rect.x = this.x + 14;
  this.rect.y = this.y + 33;
  if (Date.now() > this.end) {
    this.replace();
  }
  //Player will reach the water when hitting the key.
  if (this.checkElementCollision()) {
    player.row = 1;
    this.replace();
  }
};

//Player cannot pass through a Rock.
var Rock = function() {
  Element.call(this);
  this.x = (this.col - 1) * 101;
  this.y = (this.row - 1) * 83 - 73;
  this.sprite = 'images/rock.png';
  //The rectangle outline of the rock, not the rock image.
  this.rect = {x: (this.x + 1), y: (this.y + 77), width: 98, height: 66};
};

Rock.prototype = Object.create (Element.prototype);
Rock.prototype.constructor = Rock;

//Replace the rock if it is outdated.
Rock.prototype.update = function() {
  this.rect.x = this.x + 1;
  this.rect.y = this.y + 77;
  if (Date.now() > this.end) {
    this.replace();
    //Rock has different image position from other elements.
    this.x = (this.col - 1) * 101;
    this.y = (this.row - 1) * 83 - 73;
  }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(sprite) {
  //Property isActive is set to false before choosing character and the player will be hidden, user input will be handled by functions chooseChar and chooseCharMouse. Property isActive will be set to true after user chooses a character and player will be rendered to the screeen, user input will be handled by functions handleInput and handleInputMouse.
  this.isActive = false;
  this.row = 10;
  this.col = 4;
  this.x = (this.col - 1) * 101;
  this.y = (this.row - 1) * 83 - 60;
  this.sprite = sprite;
  //The rectangle outline of the player, not the player image.
  this.rect = {x: (this.x + 17), y: (this.y + 63), width: 66, height: 78};
  //Property isAlive will be set to false after the player hits a bug and before the player is back to the original position.
  this.isAlive = true;
  //Property isShaking will be set to true after the player hits a bug and before the player is back to the original position.
  this.isShaking = false;
  //Property isHidden will be set to true and false alternately to show a shaking player.
  this.isHidden = false;
};

Player.prototype.update = function(dt) {
  this.x = (this.col - 1) * 101;
  this.y = (this.row - 1) * 83 - 60;
  this.rect.x = this.x + 17;
  this.rect.y = this.y + 63;
  //Variable life will decrease by 1 after player hits a bug.
  if (!this.isShaking) this.checkEnemyCollision();
  if (!this.isAlive && !this.isShaking) {
    life -= 1;
    updateLife();
    this.isShaking = true;
    setTimeout(this.positionBack.bind(this), 1500);
    //If life = 0, all data will be reset.
    if (life === 0) {
      //Show gameover text.
      showFailText();
      initData();
    }
  }

  //Variable life will increase by 1 after player reaches the water.
  if (this.row === 1) {
    //Set this.row a little larger than 1 is to ensure below functions will only be called once and the player will stay at the same position for 1.5s.
    this.row = 1.001;
    //Show sucess text.
    showSuccessText(this);
    setTimeout(this.positionBack.bind(this), 1500);
    success += 1;
    updateSuccess();
  }
};

Player.prototype.render = function() {
  //Property isActive will be set to false before choosing character, at that time the player will not be rendered to the screen. After user chooses a character, isActive will be set to true, player will the rendered.
  if (this.isActive && !this.isShaking) ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  //Property isHidden will be set to true and false alternately to show a shaking player.
  if (this.isShaking) {
    if (!this.isHidden) {
      ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
      this.isHidden = true;
      return;
    }
    if (this.isHidden) this.isHidden = false;
  }
};

//Set the position of the player back.
Player.prototype.positionBack = function() {
  this.row = 10;
  this.col = 4;
  this.isAlive = true;
  this.isShaking = false;
};

//This function handles left, up, right and down key input. It moves the player inside the canvas if it is not blocked by a rock.
Player.prototype.handleInput = function(key) {
  if (this.row !== 1.001 && !this.isShaking) {
    if (key === 'left' && this.col > 1 && !(rock.row === this.row && rock.col === (this.col - 1))) this.col--;
    if (key === 'up' && this.row > 1 && !(rock.row === (this.row - 1) && rock.col === this.col)) this.row--;
    if (key === 'right' && this.col < 7 && !(rock.row === this.row && rock.col === (this.col + 1))) this.col++;
    if (key === 'down' && this.row < 10 && !(rock.row === (this.row + 1) && rock.col === this.col)) this.row++;
  }
};

//This function handles mouse and touch input. It moves the player inside the canvas if it is not blocked by a rock.
Player.prototype.handleInputMouse = function(x, y) {
  if (this.row !== 1.001 && !this.isShaking) {
    if (this.x - 101 < x && x < this.x && this.y + 62 < y && y < this.y + 62 + 83 && this.col > 1 && !(rock.row === this.row && rock.col === (this.col - 1))) this.col--;
    if (this.x < x && x < this.x + 101 && this.y + 62 - 83 < y && y < this.y + 62 && this.row > 1 && !(rock.row === (this.row - 1) && rock.col === this.col)) this.row--;
    if (this.x + 101 < x && x < this.x + 101 + 101 && this.y + 62 < y && y < this.y + 62 + 83 && this.col < 7 && !(rock.row === this.row && rock.col === (this.col + 1))) this.col++;
    if (this.x < x && x < this.x + 101 && this.y + 62 + 83 < y && y < this.y + 62 + 83 + 83 && this.row < 10 && !(rock.row === (this.row + 1) && rock.col === this.col)) this.row++;
  }
};

//Check if the player hits a bug.
Player.prototype.checkEnemyCollision = function () {
  for (var i = 0, length = allEnemies.length; i < length; i++) {
    if (
      this.rect.x < allEnemies[i].rect.x + allEnemies[i].rect.width &&
      this.rect.x + this.rect.width > allEnemies[i].rect.x &&
      this.rect.y < allEnemies[i].rect.y + allEnemies[i].rect.height &&
      this.rect.y + this.rect.height > allEnemies[i].rect.y
    ) this.isAlive = false;
  }
};

var Selector = function() {
  //Character index. Original choice is the 3rd one.
  this.index = 2;
  this.x = (this.index + 1) * 101;
  this.y = 697;
  this.sprite = 'images/selector.png';
  this.chars = ['images/char-boy.png', 'images/char-cat-girl.png', 'images/char-horn-girl.png', 'images/char-pink-girl.png', 'images/char-princess-girl.png'];
};

Selector.prototype.update = function() {
  this.x = (this.index + 1) * 101;
};

Selector.prototype.render = function() {
  //After user shooses a character, property isActive will be set to true. Drawing of the selector and the 5 characters will stop.
  if (!player.isActive) {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    this.chars.forEach(function(elt, i) {
      ctx.drawImage(Resources.get(elt), 101 * i + 101, 687);
    });
  }
};

//It handles the left, right, and enter key input when choosing character.
Selector.prototype.handleInput = function(key) {
  if (key === 'left' && this.index > 0) {
    this.index--;
  }
  if (key === 'right' && this.index < 4) {
    this.index++;
  }
  if (key === 'enter') {
    this.enter();
  }
};

//It handles the mouse and touch input when choosing character.
Selector.prototype.handleInputMouse = function(x, y) {
  if (750 < y && y < 868 && 101 < x && x < 606) {
    this.index = parseInt(x / 101) - 1;
  }
};

//'Select the Character' button onclick function.
Selector.prototype.enter = function() {
  if (!player.isActive) {
    player.sprite = this.chars[this.index];
    player.isActive = true;
  }
};

//Create 5 new bugs at proper intervals.
var createEnemy = function() {
  allEnemies.push(new Enemy(), new Enemy(), new Enemy(), new Enemy(), new Enemy());
  setTimeout(createEnemy, BUG_INTERVAL);
};

//Kill 5 oldest bugs at proper intervals after 20s;.
var killEnemy = function() {
  setTimeout(function() {
    allEnemies.splice(0, 5);
    setTimeout(killEnemy, BUG_INTERVAL);
  }, 20000);
};

//Create 3 gems, 1 star, 1 heart, 1 key, and 1 rock.
var createElement = function() {
  allElements.push(new Gem(), new Gem(), new Gem(), new Star(), new Heart(), new Key(), rock);
  for (var i = 0, length = allElements.length; i < length; i++) {
    while (allElements[i].checkDuplicatedPos()) {
      allElements[i].replace();
    }
  }
};

//Update score, life and success times in HTML.
var updateScore = function() {
  document.querySelector('.score').innerHTML = 'Score = ' + score;
};

var updateLife = function() {
  document.querySelector('.life').innerHTML = 'Life = ' + life;
};

var updateSuccess = function() {
  document.querySelector('.success').innerHTML = 'Success = ' + success;
};

//This function will be called at the beginning of the game, or when life = 0, or user click the "Restart" button.
var initData = function() {
  score = 0;
  life = 5;
  success = 0;
  updateScore();
  updateLife();
  updateSuccess();
  selector.index = 2;
  selector.x = (selector.index + 1) * 101;
  selector.y = 697;
  //Below statements are redundance if initData is not called by clicking the button.
  player.isActive = false;
  player.isAlive = true;
  player.isShaking = false;
  player.positionBack();
};

//Show success and gameover text in HTML.
var showSuccessText = function(player) {
  var successText = $('.success-text');
  successText.css({
    'display': 'block',
    'top': $('canvas').offset().top + 20,
    'left': $('canvas').offset().left + player.x - 38
  });
  setTimeout(function() {successText.css('display', 'none');}, 1500);
};

var showFailText = function() {
  var failText = $('.fail-text');
  failText.css({
    'display': 'block',
    'top': $('canvas').offset().top,
    'left': $('canvas').offset().left,
    'width': $('canvas').width(),
    'height': $('canvas').height(),
    'line-height': $('canvas').height() + 'px'
  });
  setTimeout(function() {failText.css('display', 'none');}, 1500);
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
// Place all elements objects in an array called allElements
var allEnemies = [],
    allElements = [],
    //The first player is with a certain sprite.
    player = new Player('images/char-horn-girl.png'),
    //The rock element has a identifier. It facilitates the player to check if the rock blocks the way.
    rock = new Rock(),
    selector = new Selector();

createEnemy();
killEnemy();
createElement();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down',
      13: 'enter'
  };
  //Different functions to handle key input depending on the property isActive.
  if (!player.isActive) selector.handleInput(allowedKeys[e.keyCode]);
  else player.handleInput(allowedKeys[e.keyCode]);
});

// This listens for mouse clicks and sends the coordinates of the click relative to the canvas to Player.handleInputMouse method.
$(document).on('mouseup', function(e) {
  var x = e.pageX - $(e.target).offset().left;
  var y = e.pageY - $(e.target).offset().top;
  if (e.target === document.querySelector('canvas') && player.row !== 1.001) {
    //Different functions to handle key input depending on the property isActive.
    if (!player.isActive) selector.handleInputMouse(x, y);
    else player.handleInputMouse(x, y);
  }
});

//This listens for touch events and sends the coordinates of the touch relative to the canvas to Player.handleInputMouse method.
$(document).on('touchstart', function(e) {
  // e.preventDefault();
  var x = e.originalEvent.touches[0].pageX - $(e.target).offset().left;
  var y = e.originalEvent.touches[0].pageY - $(e.target).offset().top;
  if (e.target === document.querySelector('canvas') && player.row !== 1.001) {
    //Different functions to handle key input depending on the property isActive.
    if (!player.isActive) selector.handleInputMouse(x, y);
    else player.handleInputMouse(x, y);
  }
});
