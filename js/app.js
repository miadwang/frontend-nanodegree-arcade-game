var initialLoc = -101,
    bugHighSpeed = 150,
    bugLowSpeed = 50,
    playerSpeed = 50,
    interval = 3000,
    selector = 'images/selector.png',
    chars = ['images/char-boy.png', 'images/char-cat-girl.png', 'images/char-horn-girl.png', 'images/char-pink-girl.png', 'images/char-princess-girl.png'];

// Enemies our player must avoid
var Enemy = function() {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started
  this.row = Math.floor(Math.random() * 7 + 2);
  this.speed = Math.floor(Math.random() * (bugHighSpeed - bugLowSpeed + 1) + bugLowSpeed);
  this.x = initialLoc;
  this.y = (this.row - 1) * 83 - 73;
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
  this.x = (this.col - 1) * 101 + 22;
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
  if (this.color === 1) this.sprite = 'images/gem-blue-small.png';
  if (this.color === 2) this.sprite = 'images/gem-green-small.png';
  if (this.color === 3) this.sprite = 'images/gem-orange-small.png';
  this.rect = {x: (this.x + 2), y: (this.y + 34), width: 55, height: 61};
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
  this.sprite = 'images/star-small.png';
  this.rect = {x: (this.x + 2), y: (this.y + 32), width: 55, height: 55};
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
  this.sprite = 'images/heart-small.png';
  this.rect = {x: (this.x + 4), y: (this.y + 28), width: 52, height: 52};
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
  this.sprite = 'images/key-small.png';
  this.rect = {x: (this.x + 14), y: (this.y + 33), width: 30, height: 54};
};

Key.prototype = Object.create(Element.prototype);
Key.prototype.constructor = Key;

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
  this.x = (this.col - 1) * 101;
  this.y = (this.row - 1) * 83 - 73;
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
var Player = function(sprite) {
  this.isActive = true;
  this.row = 10;
  this.col = 4;
  this.x = (this.col - 1) * 101;
  this.y = (this.row - 1) * 83 - 60;
  this.sprite = sprite;
  this.rect = {x: (this.x + 17), y: (this.y + 63), width: 66, height: 78};
  this.isAlive = true;
};

Player.prototype.update = function(dt) {
  this.x = (this.col - 1) * 101;
  this.y = (this.row - 1) * 83 - 60;
  this.rect.x = this.x + 17;
  this.rect.y = this.y + 63;
  if (this.checkEnemyCollision()) {
    this.isAlive = false;
    life -= 1;
    updateLife();
    if (life === 0) {
      showFailText();
      player.row = 10;
      player.y = 737;
      return;
    }
    player = new Player(chars[index]);
  }

  if (this.row === 1) {
    showSuccessText(this);
    this.row = 1.001;
    setTimeout(function() {
      player = new Player(chars[index]);
    }, 1500);
    success += 1;
    updateSuccess();
  }
};

Player.prototype.render = function() {
  if (player.isActive) ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(key) {
  if (key === 'left' && this.col > 1 && !(rock.row === this.row && rock.col === (this.col - 1))) this.col--;
  if (key === 'up' && this.row > 1 && !(rock.row === (this.row - 1) && rock.col === this.col)) this.row--;
  if (key === 'right' && this.col < 7 && !(rock.row === this.row && rock.col === (this.col + 1))) this.col++;
  if (key === 'down' && this.row < 10 && !(rock.row === (this.row + 1) && rock.col === this.col)) this.row++;
};

Player.prototype.handleInputMouse = function(x, y) {
  if (this.x - 101 < x && x < this.x && this.y + 62 < y && y < this.y + 62 + 83 && this.col > 1 && !(rock.row === this.row && rock.col === (this.col - 1))) this.col--;
  if (this.x < x && x < this.x + 101 && this.y + 62 - 83 < y && y < this.y + 62 && this.row > 1 && !(rock.row === (this.row - 1) && rock.col === this.col)) this.row--;
  if (this.x + 101 < x && x < this.x + 101 + 101 && this.y + 62 < y && y < this.y + 62 + 83 && this.col < 7 && !(rock.row === this.row && rock.col === (this.col + 1))) this.col++;
  if (this.x < x && x < this.x + 101 && this.y + 62 + 83 < y && y < this.y + 62 + 83 + 83 && this.row < 10 && !(rock.row === (this.row + 1) && rock.col === this.col)) this.row++;
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

var initNewChar = function() {
  score = 0;
  life = 5;
  success = 0;
  selectorX = 303;
  selectorY = 697;
  index = 2;
  updateLife();
  updateScore();
  updateSuccess();
  player.isActive = false;
};

var showChars = function() {
  ctx.drawImage(Resources.get(selector), selectorX, selectorY);
  chars.forEach(function(elt, i) {
    ctx.drawImage(Resources.get(elt), 101 * i + 101, 687);
  });

  if (player.isActive) {
    return;
  }
  window.requestAnimationFrame(showChars);
};

var chooseChar = function(key) {
  if (key === 'left' && index > 0) {
    index--;
    selectorX -= 101;
  }
  if (key === 'right' && index < 4) {
    index++;
    selectorX += 101;
  }
  if (key === 'enter') {
    player = new Player(chars[index]);
  }
};

var chooseCharMouse = function(x, y) {
  if (750 < y && y < 868) {
    if (101 < x && x < 202) {
      index = 0;
      selectorX = 101;
    }
    if (202 < x && x < 303) {
      index = 1;
      selectorX = 202;
    }
    if (303 < x && x < 404) {
      index = 2;
      selectorX = 303;
    }
    if (404 < x && x < 505) {
      index = 3;
      selectorX = 404;
    }
    if (505 < x && x < 606) {
      index = 4;
      selectorX = 505;
    }
  }
};

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

var restart = function() {
  initNewChar();
  showChars();
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [],
    allElements = [],
    player = new Player('images/char-horn-girl.png');
    rock = new Rock();

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
      40: 'down',
      13: 'enter'
  };

  if (!player.isActive) chooseChar(allowedKeys[e.keyCode]);
  else player.handleInput(allowedKeys[e.keyCode]);
});

$(document).on('click', function(e) {
  var x = e.pageX - $(e.target).offset().left;
  var y = e.pageY - $(e.target).offset().top;
  if (e.target === document.querySelector('canvas')) {
    if (!player.isActive) chooseCharMouse(x, y);
    else player.handleInputMouse(x, y);
  }
});
