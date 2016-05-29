var initialLoc = -101,
    bugHighSpeed = 150,
    bugLowSpeed = 50,
    playerSpeed = 50,
    interval = 2500;

// Enemies our player must avoid
var Enemy = function() {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started
  this.row = Math.floor(Math.random() * 3 + 2);
  this.speed = Math.floor(Math.random() * (bugHighSpeed - bugLowSpeed + 1) + bugLowSpeed);
  this.x = initialLoc;
  this.y = (this.row - 1) * 83 - 20;
  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = 'images/enemy-bug.png';
  this.rect = {x: (this.x + 1), y: (this.y + 77), width: 98, height: 66};
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
  this.x += dt * this.speed;
  this.rect.x = this.x;
  this.rect.y = this.y;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  if (this.x < 500) ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
  this.row = 6;
  this.col = 3;
  this.x = (this.col - 1) * 101;
  this.y = (this.row - 1) * 83 - 10;
  this.sprite = 'images/char-boy.png';
  this.rect = {x: (this.x + 17), y: (this.y + 63), width: 66, height: 78};
  this.isAlive = true;
};

Player.prototype.update = function(dt) {
  this.x = (this.col - 1) * 101;
  this.y = (this.row - 1) * 83 - 10;
  this.rect.x = this.x;
  this.rect.y = this.y;
  if (checkCollisions()) {
    this.isAlive = false;
    player = new Player;
  }
  if (this.row === 1) {
    setTimeout(function() {player = new Player;}, 2000);
  }
};

// Draw the enemy on the screen, required method for game
Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(key) {
  if (key === 'left' && this.col > 1) this.col--;
  if (key === 'up' && this.row > 1) this.row--;
  if (key === 'right' && this.col < 5) this.col++;
  if (key === 'down' && this.row < 6) this.row++;
};

var checkCollisions = function () {
  for (var i = 0, length = allEnemies.length; i < length; i++) {
    if (
      player.rect.x < allEnemies[i].rect.x + allEnemies[i].rect.width &&
      player.rect.x + player.rect.width > allEnemies[i].rect.x &&
      player.rect.y < allEnemies[i].rect.y + allEnemies[i].rect.height &&
      player.rect.y + player.rect.height > allEnemies[i].rect.y
    ) return true;
  }
  return false;
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [],
    player = new Player;

var createEnemy = function() {
  allEnemies.push(new Enemy(), new Enemy(), new Enemy());
};

var killEnemy = function() {
  setInterval(function () {
    allEnemies.splice(0, 3);
  }, interval);
};

createEnemy();
setInterval(createEnemy, interval);
setTimeout(killEnemy, 10000);


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});

//TODO: 1) Shake when die. 2) Shine when success. 3) Collect coins and show scores. 4) Show success times and die times. 5) Show enter picture. 6) Show reload, share scores icon. 7) Be able to shoose player. 8) Add rock blocking the way. 9) Add heart for 3 try. 10) Add Gameover picture and share and restart button.
