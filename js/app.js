var initialLoc = -101,
    bugHighSpeed = 150,
    bugLowSpeed = 50,
    playerSpeed = 50,
    interval = 3000;

// Enemies our player must avoid
var Enemy = function() {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started
  this.row = Math.floor(Math.random() * 7 + 2);
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
  this.rect.x = this.x + 1;
  this.rect.y = this.y + 77;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Element = function() {
  this.row = Math.floor(Math.random() * 6 + 2);
  this.col = Math.floor(Math.random() * 6 + 1);
  this.x = (this.col - 1) * 101;
  this.y = (this.row - 1) * 83 - 20;
  this.duration = Math.floor(Math.random() * 100000 + 3000);
  this.alive = true;
  this.start = Date.now();
  this.end = this.start + this.duration;
};

Element.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Element.prototype.checkElementCollision = function() {
  if (
    player.rect.x < this.rect.x + this.rect.width &&
    player.rect.x + player.rect.width > this.rect.x &&
    player.rect.y < this.rect.y + this.rect.height &&
    player.rect.y + player.rect.height > this.rect.y
  ) return true;

  return false;
};

Element.prototype.replace = function() {
  var pos = allElements.indexOf(this);
  allElements.splice(pos, 1);
  allElements.push(new this.constructor());
};

var Gem = function() {
  Element.call(this);
  this.color = Math.floor(Math.random() * 2 + 1);
  if (this.color === 1) this.sprite = 'images/gem-blue.png';
  if (this.color === 2) this.sprite = 'images/gem-green.png';
  if (this.color === 3) this.sprite = 'images/gem-orange.png';
  this.rect = {x: (this.x), y: (this.y), width: 98, height: 66};
};

Gem.prototype = Object.create(Element.prototype);
Gem.prototype.constructor = Gem;

Gem.prototype.update = function() {
  if (Date.now() > this.end) {
    this.replace();
  }
  if (this.checkElementCollision()) {
    score++;
    updateScore();
    this.replace();
  }
};

var Star = function() {
  Element.call(this);
  this.sprite = 'images/star.png';
  this.rect = {x: (this.x), y: (this.y), width: 98, height: 66};
};

Star.prototype = Object.create(Element.prototype);
Star.prototype.constructor = Star;

Star.prototype.update = function() {
  if (Date.now() > this.end) {
    this.replace();
  }
  if (this.checkElementCollision()) {
    score += 5;
    updateScore();
    this.replace();
  }
};

var Heart = function() {
  Element.call(this);
  this.sprite = 'images/heart.png';
  this.rect = {x: (this.x), y: (this.y), width: 98, height: 66};
};

Heart.prototype = Object.create(Element.prototype);
Heart.prototype.constructor = Heart;

Heart.prototype.update = function() {
  if (Date.now() > this.end) {
    this.replace();
  }
  if (this.checkElementCollision()) {
    life += 3;
    updateLife();
    this.replace();
  }
};

var Key = function() {
  Element.call(this);
  this.sprite = 'images/key.png';
  this.rect = {x: (this.x), y: (this.y), width: 98, height: 66};
};

Key.prototype = Object.create(Element.prototype);
Key.prototype.constructor = Heart;

Key.prototype.update = function() {
  if (Date.now() > this.end) {
    this.replace();
  }
  if (this.checkElementCollision()) {
    player.row = 1;
    this.replace();
  }
};

var Rock = function() {
  Element.call(this);
  this.sprite = 'images/rock.png';
  this.rect = {x: (this.x + 1), y: (this.y + 77), width: 98, height: 66};
};

Rock.prototype = Object.create (Element.prototype);
Rock.prototype.constructor = Rock;

Rock.prototype.replace = function() {
  var pos = allElements.indexOf(this);
  allElements.splice(pos, 1);
  rock = new Rock();
  allElements.push(rock);
};

Rock.prototype.update = function() {
  if (Date.now() > this.end) this.replace();
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
  this.row = 10;
  this.col = 4;
  this.x = (this.col - 1) * 101;
  this.y = (this.row - 1) * 83 - 10;
  this.sprite = 'images/char-boy.png';
  this.rect = {x: (this.x + 17), y: (this.y + 63), width: 66, height: 78};
  this.isAlive = true;
};

Player.prototype.update = function(dt) {
  this.x = (this.col - 1) * 101;
  this.y = (this.row - 1) * 83 - 10;
  this.rect.x = this.x + 17;
  this.rect.y = this.y + 63;
  if (this.checkEnemyCollision()) {
    this.isAlive = false;
    life -= 1;
    updateLife();
    if (life === 0) {
      life = 5;
      score = 0;
      success = 0;
      updateLife();
      updateScore();
      updateSuccess();
    }
    player = new Player;
  }

  if (this.row === 1) {
    this.row = 0;
    this.y = 0;
    player = new Player;
    success += 1;
    setTimeout(function() {
      updateSuccess();
    }, 2000);
  }
};

Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(key) {
  // console.log(rock.row, rock.col);
  if (key === 'left' && this.col > 1 && !(rock.row === this.row && rock.col === (this.col - 1))) this.col--;
  if (key === 'up' && this.row > 1 && !(rock.row === (this.row - 1) && rock.col === this.col)) this.row--;
  if (key === 'right' && this.col < 7 && !(rock.row === this.row && rock.col === (this.col + 1))) this.col++;
  if (key === 'down' && this.row < 10 && !(rock.row === (this.row + 1) && rock.col === this.col)) this.row++;
};

Player.prototype.checkEnemyCollision = function () {
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
    allElements = [];
    player = new Player(),
    rock = new Rock(),
    score = 0,
    life = 5,
    success = 0;

var createEnemy = function() {
  allEnemies.push(new Enemy(), new Enemy(), new Enemy(), new Enemy(), new Enemy());
  setTimeout(createEnemy, interval);
};

var killEnemy = function() {
  allEnemies.splice(0, 5);
  setTimeout(killEnemy, interval);
};

var createElement = function() {
  allElements.push(new Gem(), new Gem(), new Gem(), new Star(), new Heart(), new Key(), rock);
};

var updateScore = function() {
  document.querySelector('.score').innerHTML = 'Score = ' + score;
};

var updateLife = function() {
  document.querySelector('.life').innerHTML = 'Life = ' + life;
};

var updateSuccess = function() {
  document.querySelector('.success').innerHTML = 'Success = ' + success;
};

createEnemy();
setTimeout(killEnemy, 20000);
createElement();


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

//TODO: 6) Set restart icon. 7) Be able to shoose player. 10) Add Gameover and Success text. 11) CSS styles. 12) Optional: add animation. 13) Change image size and rect offset.
