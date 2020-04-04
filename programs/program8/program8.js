"use strict";
const COUNTER_OF_COINS = 7;
let counterCoins = COUNTER_OF_COINS;

const COUNTER_OF_BLOCKS = 2;
let counterBlocks = COUNTER_OF_BLOCKS;

const COUNTER_OF_PLANETS = 3;
let counterPlanets = COUNTER_OF_PLANETS;

const MAX_PLANET_SPEED = 3;
let maxPlanetSpeed = MAX_PLANET_SPEED;

const ONE_PLAYER = 1;
let onePlayer = ONE_PLAYER;

const TWO_PLAYERS = 2;
let twoPlayers = TWO_PLAYERS;

const PLAYER_LIFES = 3;
let playerLifes = PLAYER_LIFES;

const PLANET_IMAGES = 5;
let planetImgCounter = PLANET_IMAGES;

const START_PLAYER_X = 70;
let startX = START_PLAYER_X;

const START_PLAYER_Y = 150;
let startY = START_PLAYER_Y;

const SHIFT_START_PLAYER_X = 5;
let shiftStartX = SHIFT_START_PLAYER_X;

const SHIFT_START_PLAYER_Y = 50;
let shiftStartY = SHIFT_START_PLAYER_Y;

const INTERVAL_BETWEEN_BLOCKS = 160;
let interval = INTERVAL_BETWEEN_BLOCKS;

const START_SPEED = 1;
let startSpeed = START_SPEED;

let pathImg = "./src/img/";
let pathAudio = "./src/audio/";

class Img {
  constructor(name, id = "") {
    this.img = new Image();
    this.img.src = pathImg + name + id + ".png";

    return this.img;
  }
}

class Mp3 {
  constructor(name) {
    this.audio = new Audio();
    this.audio.src = pathAudio + name + ".mp3";

    return this.audio;
  }
}

class Player {
  constructor(id) {
    this.score = 0;
    this.speed = 1;
    this.id = id;
    this.life = playerLifes;

    this.x = startX + shiftStartX * id;
    this.y = id == onePlayer ? startY : startY + shiftStartY * id;

    this.img = new Img("player", id);
    this.lifeImg = new Img("life", id);

    this.record = getStorageRecord(id);
  }

  draw() {
    ctx.drawImage(this.img, this.x, this.y++);
  }

  checkCrash() {
    for (let i = 0; i < blocks.length; i++) {
      let y = blocks[i].y + blockUp.height;
      let yPlayer = this.y + this.img.height;

      // check touch Х
      let inBlockRightX = this.x + this.img.width >= blocks[i].x ? true : false;
      let inBlockLeftX = this.x <= blocks[i].x + blockUp.width ? true : false;
      let touchBlockX = inBlockRightX && inBlockLeftX ? true : false;

      // check touch Y
      let touchBlockUpY = this.y <= y ? true : false;
      let touchBlockDownY = yPlayer >= y + interval ? true : false;
      let touchBlockY = touchBlockUpY || touchBlockDownY ? true : false;

      // check touch block
      let touchBlock = touchBlockX && touchBlockY ? true : false;

      // check touch crash line
      let height = this.y + this.img.height;
      let isFall = height >= cvs.height - crashLine.height ? true : false;

      // check touch block or crash line
      if (isFall || touchBlock) {
        this.life--;
        noLifes--;
        isCrash = true;

        lifeLoose.play();
        if (!this.life) gameOver.play();

        //delete block on the screen and create new behind scene
        blocks = [];
        createBlocks(counterBlocks);

        // back to start position
        this.x = startX + shiftStartX * this.id;
        this.y = startY + shiftStartY * this.id;
      }
    }
  }

  checkRecord() {
    congratulations.play();
    // save record if your score bigger then record
    let id = isTwoPlayers ? this.id : "onePlayer";
    if (!this.life && this.record < this.score) {
      alert(`Congratulate - Player${this.id}, your RECORD: ${this.score}`);
      localStorage.setItem(id, this.score);
    }
  }

  checkCoinsTouch() {
    for (let i = 0; i < coins.length; i++) {
      let x = Math.abs(coins[i].x - this.x);
      let y = Math.abs(coins[i].y - this.y);
      let r = (coin.width + this.img.width) / 2;

      if (x < r && y < r) {
        this.score++;

        // increase speed
        if (!(this.score % 15)) {
          this.score;
          this.speed++;
        }

        scoreAudio.play();

        let shift = cvs.width / 2;
        coins[i].y = newCoinY();
        coins[i].x = newCoinX(shift);
      }
    }
  }

  drawStatistic() {
    let x = this.id == onePlayer ? 160 : 500;
    let xLife = this.id == onePlayer ? 160 : 500;

    let yShift = 35;
    let y = cvs.height - yShift;

    // draw lifes
    let shiftLifeX = 40;
    for (let i = 0; i < this.life; i++) {
      ctx.drawImage(this.lifeImg, xLife, y);
      xLife += shiftLifeX;
    }
    // draw statistic
    ctx.fillStyle = "#ffd";
    ctx.font = "26px Verdana";
    ctx.fillText("Player " + this.id + " - ", x - 140, y - 15);

    ctx.font = "20px Verdana";
    ctx.fillText("Record:" + this.record, x, y - 45);
    ctx.fillText("Score: " + this.score, x, y - 15);
  }

  move(ev) {
    if (isPause) return;
    let key = ev.code;
    let isOnePlayer = this.id == 1 ? true : false;

    let keyUp = isOnePlayer ? "ArrowUp" : "KeyW";
    let keyDown = isOnePlayer ? "ArrowDown" : "KeyS";
    let keyLeft = isOnePlayer ? "ArrowLeft" : "KeyA";
    let keyRight = isOnePlayer ? "ArrowRight" : "KeyD";

    if (key === keyRight) {
      ev.preventDefault();
      fly.play();
      this.x += 25;
    }
    if (key === keyLeft) {
      ev.preventDefault();
      fly.play();
      this.x -= 25;
    }
    if (key === keyDown) {
      ev.preventDefault();
      this.y += 25;
    }
    if (key === keyUp) {
      ev.preventDefault();
      this.y -= 35;
      fly.play();
    }

    // check player is he out of game field
    if (this.x <= 0) this.x = 0;
    if (this.y <= 0) this.y = 0;

    if (this.x + this.img.width >= cvs.width) this.x = cvs.width - this.img.width;
  }
}

//properties of game
let noLifes;
let counter = 0;
let isPause = true;
let isCrash = false;
let isTwoPlayers = false;
let speed = startSpeed;

// create and download images for game
let coin = new Img("coin");
let bgSpace = new Img("bgSpace");
bgSpace.onload = drawBackground;
let blockUp = new Img("blockUp");
let blockDown = new Img("blockDown");
let crashLine = new Img("crashLine");
let player1 = new Img("player1");
let player2 = new Img("player2");

// arrays - database of our elements
let coins = [];
let blocks = [];
let players = [];
let planets = [];
let allPlanets = [];

// create and download audio for game
let fly = new Mp3("fly");
let gameOver = new Mp3("gameOver");
let beepStart = new Mp3("beepStart");
let lifeLoose = new Mp3("lifeLoose");
let scoreAudio = new Mp3("scoreAudio");
let congratulations = new Mp3("congratulations");
let backgroundMusic = new Mp3("backgroundMusic");

let cvs = document.querySelector("#canvas");
let ctx = cvs.getContext("2d");
setStartProperties();

// control buttons
let btnNewGame = document.querySelector("#btnNewGame");
let btnStartStop = document.querySelector("#btnStartStop");
let btnOnePlayer = document.querySelector("#btnOnePlayer");
let btnTwoPlayers = document.querySelector("#btnTwoPlayers");

btnOnePlayer.addEventListener("click", () => letsPlay(onePlayer));
btnTwoPlayers.addEventListener("click", () => letsPlay(twoPlayers));
btnStartStop.addEventListener("click", pause);
btnNewGame.addEventListener("click", newGame);

document.body.addEventListener("keydown", ev => movePlayers(ev));

function newGame() {
  location.reload();
}

function letsPlay(player) {
  isPause = false;
  isTwoPlayers = player == twoPlayers ? true : false;

  hideControlButtons();
  addPlayer(player);

  startGame();
}

function startGame() {
  if (!counter) beepStart.play();

  drawGameField();
  drawPlayers();

  if (isPause) return;

  backgroundMusic.play();

  requestAnimationFrame(startGame);
}

function drawGameField() {
  drawBackground();
  drawPlanets();
  drawCoins();
  drawBlocks();
  drawCrashLine();
}

function checkWinner() {
  if (!isTwoPlayers) return;
  congratulations.play();

  if (players[0].score == players[1].score) alert("Winner: FRENDSHIP");
  else if (players[0].score > players[1].score) alert("Winner: PLAYER - 1");
  else alert("Winner: PLAYER - 2");
}

function drawPlayers() {
  if (!noLifes) {
    isPause = true;
    gameOver.play();

    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;

    alert("Game Over");

    players.forEach(element => element.checkRecord());

    checkWinner();

    newGame();
  }

  for (let i = 0; i < players.length; i++) {
    players[i].drawStatistic();

    if (players[i].life === 0) continue;

    players[i].draw();
    players[i].checkCrash();
    players[i].checkCoinsTouch();

    if (players[i].speed > speed) speed++;
  }

  if (isCrash && speed != 1) {
    players.forEach(element => {
      element.speed--;
    });
    speed--;
    isCrash = false;
  }
}

function drawBackground() {
  ctx.drawImage(bgSpace, 0, 0);
}

function drawCrashLine() {
  ctx.drawImage(crashLine, 0, cvs.height - crashLine.height);
}

function drawCoins() {
  for (let i = 0; i < coins.length; i++) {
    if (coins[i].x > -60) {
      ctx.drawImage(coin, coins[i].x--, coins[i].y);
    } else {
      coins[i].y = newCoinY();
      coins[i].x = newCoinX();
    }
  }
}

function drawPlanets() {
  counter++;
  for (let i = 0; i < planets.length; i++) {
    if (planets[i].x > -60) {
      if (planets[i].speed == 1 && counter % 2) {
        ctx.drawImage(planets[i].name, planets[i].x, planets[i].y);
      } else if (planets[i].speed == 2 && counter % 3) {
        ctx.drawImage(planets[i].name, planets[i].x, planets[i].y);
      } else {
        ctx.drawImage(planets[i].name, planets[i].x--, planets[i].y);
      }
    } else {
      planets[i].y = newPlanetY();
      planets[i].x = movePlanetX();
      planets[i].name = newPlanetName();
    }
  }
}

function drawBlocks() {
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].x + blockUp.width >= 0) {
      let yDown = blocks[i].y + blockUp.height + interval;

      ctx.drawImage(blockUp, blocks[i].x, blocks[i].y);
      ctx.drawImage(blockDown, blocks[i].x, yDown);

      blocks[i].x -= speed;
    } else {
      let shift = 60;

      blocks[i].y = newBlockY();
      blocks[i].x = newBlockX(shift);
    }
  }
}

function setStartProperties() {
  if (!localStorage.getItem(onePlayer)) {
    localStorage.setItem(onePlayer, 0);
  }

  if (!localStorage.getItem(twoPlayers)) {
    localStorage.setItem(twoPlayers, 0);
  }

  if (!localStorage.getItem("onePlayer")) {
    localStorage.setItem("onePlayer", 0);
  }

  createPlanets(counterPlanets);

  createCoins(counterCoins);

  createBlocks(counterBlocks);

  setTimeout(drawFirstPlayer, 800);

  setTimeout(drawSecondPlayer, 850);

  crashLine.onload = drawCrashLine;
}

function drawFirstPlayer() {
  ctx.drawImage(player1, startX, startY);
}

function drawSecondPlayer() {
  ctx.drawImage(player2, startX, startY + shiftStartY * 2);
}

function createCoins(counter) {
  for (let i = 0; i < counter; i++)
    coins.push({
      x: newCoinX(),
      y: newCoinY()
    });
}

function createPlanets(counter) {
  // download all planet's images
  for (let i = 1; i <= planetImgCounter; i++) {
    let planet = new Img("planet", i);
    allPlanets.push(planet);
  }

  // create need count of planets
  for (let i = 0; i < counter; i++)
    planets.push({
      x: newPlanetX(),
      y: newPlanetY(),
      name: newPlanetName(),
      speed: newPlanetSpeed()
    });
}

function createBlocks(counter) {
  let shift = 0;

  for (let i = 0; i < counter; i++) {
    blocks.push({
      x: newBlockX(shift),
      y: newBlockY()
    });
    shift += Math.round((cvs.width * 2) / 3);
  }
}

function newCoinY() {
  return Math.round(Math.random() * (cvs.height - crashLine.height - 50));
}

function newCoinX(shift = 0) {
  return Math.round(Math.random() * cvs.width) + shift;
}

function newBlockY() {
  return Math.floor(Math.random() * blockUp.height) - blockUp.height;
}

function newBlockX(shift = 0) {
  return cvs.width + shift;
}

function newPlanetY() {
  return Math.round(Math.random() * (cvs.height - crashLine.height - 50));
}

function newPlanetX() {
  return Math.round(Math.random() * cvs.width);
}

function newPlanetName() {
  let i = Math.round(Math.random() * 4);
  return allPlanets[i];
}

function newPlanetSpeed() {
  return Math.ceil(Math.random() * maxPlanetSpeed);
}

function movePlanetX() {
  return cvs.width + 10;
}

function addPlayer(counter) {
  for (let i = 1; i < counter + 1; i++) {
    let player = new Player(i);
    players.push(player);
  }
  noLifes = counter * playerLifes;
}

function hideControlButtons() {
  btnOnePlayer.classList.add("dont-show");
  btnTwoPlayers.classList.add("dont-show");
  btnStartStop.classList.add("visible");
}

function movePlayers(ev) {
  for (let i = 0; i < players.length; i++) players[i].move(ev);
}

function pause() {
  let text = btnStartStop.innerText;

  isPause = text === "Pause" ? true : false;
  btnStartStop.innerText = text === "Pause" ? "Play" : "Pause";

  startGame();
}

function getStorageRecord(id) {
  let mode1 = Number(localStorage.getItem(id));
  let mode2 = Number(localStorage.getItem("onePlayer"));

  let record = isTwoPlayers ? mode1 : mode2;
  return record;
}

function getSpeed() {
  let checkScore = players[0].life ? players[0].score : players[1].score;
  console.log("getSpeed -> checkScore", checkScore);
  console.log(checkScore % 10);

  if (!(checkScore % 10)) speed++;
}
