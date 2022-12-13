document.getElementById(
  "info"
).innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`;
const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");
let lastTime;
let frameAccumulator = 0;
let startTime;

canvas.width = columns * tileSize;
canvas.height = rows * tileSize;

const scoreDiv = document.getElementById("score");
scoreDiv.innerText = "00";

const heatGauge = document.getElementById("merc");

const startScreen = document.getElementById("start-screen");

const resultsText = document.getElementById("results");
const resetBtn = document.getElementById("reset");

//checks distance between meat and player
function checkDist() {
  //pythagorean theorem
  const a = guy.pos.x - meat.pos.x;
  const b = guy.pos.y - meat.pos.y;
  const c2 = a * a + b * b;
  return c2;
}
//Takes square of distance and compares to square of distance thresholds
function adjustHeat(distSQ) {
  const closeSQ = distThresholds.close * distThresholds.close;
  const farSQ = distThresholds.far * distThresholds.far;
  if (distSQ <= closeSQ) {
    music.volume = 1;
    heatGauge.style.backgroundColor = `rgb(255, 0, 0)`;
    heatGauge.style.height = "100%";
  } else if (distSQ > closeSQ && distSQ < farSQ) {
    const distRange = farSQ - closeSQ;
    const meterHeight = 100 * (Math.abs(distSQ - distRange) / distRange);
    music.volume = 0.15 + meterHeight *.85 / 100;
    const colorMod = Math.floor(
      255 * (Math.abs(distSQ - distRange) / distRange)
    );
    const redVal = colorMod;
    const blueVal = 255 - colorMod;
    let grnVal;
    if (blueVal > redVal) grnVal = colorMod;
    else grnVal = 255 - colorMod * 0.5;
    heatGauge.style.backgroundColor = `rgb(${redVal}, ${grnVal}, ${blueVal})`;
    heatGauge.style.height = `${meterHeight}%`;
  } else if (distSQ >= farSQ) {
    music.volume = 0.15;
    heatGauge.style.backgroundColor = `rgb(0, 0, 255)`;
    heatGauge.style.height = "15%";
  }
}
//collision detection
function isColliding(rect1, rect2) {
  return (
    rect1.pos.x + tileSize > rect2.pos.x &&
    rect1.pos.x < rect2.pos.x + tileSize &&
    rect1.pos.y + tileSize > rect2.pos.y &&
    rect1.pos.y < rect2.pos.y + tileSize
  );
}
//Handler for character movement
function updatePosition() {
  if (keysPressed.up) {
    let moveUp = true;
    for (let i = 0; i < boundaries.length; i++) {
      const bound = boundaries[i];
      if (
        isColliding(
          { ...guy, pos: { x: guy.pos.x, y: guy.pos.y - guy.vel } },
          bound
        )
      ) {
        bumpSfx.play();
        moveUp = false;
        break;
      }
    }
    if (moveUp) guy.pos.y -= guy.vel;
  }
  if (keysPressed.down) {
    let moveDown = true;
    for (let i = 0; i < boundaries.length; i++) {
      const bound = boundaries[i];
      if (
        isColliding(
          { ...guy, pos: { x: guy.pos.x, y: guy.pos.y + guy.vel } },
          bound
        )
      ) {
        bumpSfx.play();
        moveDown = false;
        break;
      }
    }
    if (moveDown) guy.pos.y += guy.vel;
  }
  if (keysPressed.left) {
    let moveLeft = true;
    for (let i = 0; i < boundaries.length; i++) {
      const bound = boundaries[i];
      if (
        guy.pos.x - guy.vel < 0 ||
        isColliding(
          {
            ...guy,
            pos: { x: guy.pos.x - guy.vel, y: guy.pos.y },
          },
          bound
        )
      ) {
        bumpSfx.play();
        moveLeft = false;
        break;
      }
    }
    if (moveLeft) guy.pos.x -= guy.vel;
  }
  if (keysPressed.right) {
    let moveRight = true;
    for (let i = 0; i < boundaries.length; i++) {
      const bound = boundaries[i];
      if (
        isColliding(
          { ...guy, pos: { x: guy.pos.x + guy.vel, y: guy.pos.y } },
          bound
        )
      ) {
        bumpSfx.play();
        moveRight = false;
        break;
      }
    }
    if (moveRight) guy.pos.x += guy.vel;
  }
}
function drawScene() {
  background.draw();
  guy.draw();
  towerPlatform.draw();
  foreground.draw();
  meat.draw();
}
//countdown timer value
function setTimerValue(current, start) {
  timeLeftms =
    roundDuration + 3000 * parseInt(scoreDiv.innerText) - (current - start);
  const clockMins = Math.floor(timeLeftms / (1000 * 60));
  const clockSecs =
    Math.floor((timeLeftms / 1000) % 60) < 10
      ? `0${Math.floor((timeLeftms / 1000) % 60)}`
      : Math.floor((timeLeftms / 1000) % 60);
  let clockMs = Math.ceil(Math.floor(timeLeftms % 1000) / 100);
  if (clockMs === 10) clockMs = 0;
  // else if(clockMs < 100)clockMs = `0${clockMs}`
  document.getElementById(
    "timer"
  ).innerText = `${clockMins}:${clockSecs}.${clockMs}`;
}
//calculation rate setter
function logicTick(current, previous) {
  frameAccumulator += (current - previous) / 1000;
  // console.log(frameAccumulator)
  while (frameAccumulator > frameRate) {
    boundaries.forEach((boundary) => isColliding(guy, boundary));
    updatePosition();
    adjustHeat(checkDist());
    frameAccumulator -= frameRate;
    drawScene();
  }
}
//Results Screens Triggers
function showLoseScreen() {
  cancelAnimationFrame(animID);
  music.pause();
  gameOver.play();
  lostGame = true;
  startTime = null;
  // timeLeftms = roundDuration - (performance.now() - startTime);
  resultsText.innerText = losingText;
  resultsText.style.zIndex = 3;
  resetBtn.style.zIndex = 4;
}
function showWinScreen() {
  cancelAnimationFrame(animID);
  startTime = null;
  resultsText.innerText = winningText;
  resultsText.style.zIndex = 3;
  resetBtn.style.zIndex = 4;
}
//game loop
function animate(timestamp) {
  if (music.ended) music.play();
  if (!lastTime) lastTime = timestamp;
  if (!startTime) startTime = timestamp;
  // console.log(music.volume)
  //in game timer value
  setTimerValue(performance.now(), startTime);
  if (Object.entries(keysPressed).filter((key) => key[1] === true).length > 0)
    isMoving = true;
  else isMoving = false;
  //frame rate limiter loop, should help keep game Tick rate at 60 calcs per sec
  if (lastTime) logicTick(performance.now(), lastTime);
  if (timeLeftms <= 0 && startTime) showLoseScreen();
  else if (wonGame) showWinScreen();
  else {
    lastTime = timestamp;
    animID = window.requestAnimationFrame(animate);
  }
}
//game starter
function gameStart() {
  gameStarted = true;
  music.play();
  startScreen.style.display = "none";
  meat.hide();
  animate();
}
//example of ipc
const funk = async () => {
  const res = await window.versions.ping();
  console.log(res);
};
//EVENT LISTENERS
//Key Press Listneners
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      isDigging = false;
      keysPressed.up = true;
      lastAct = "up";
      break;
    case "ArrowDown":
      isDigging = false;
      keysPressed.down = true;
      lastAct = "down";
      break;
    case "ArrowLeft":
      isDigging = false;
      keysPressed.left = true;
      lastAct = "left";
      break;
    case "ArrowRight":
      isDigging = false;
      keysPressed.right = true;
      lastAct = "right";
      break;
    case " ":
      if (!gameStarted) gameStart();
      else {
        lastAct = "dig";
        isDigging = true;
        for (let key in keysPressed) keysPressed[key] = false;
        if (isColliding(guy, meat)) meat.found();
        else console.log("miss");
      }
      break;
    default:
      break;
  }
});
window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "ArrowUp":
      keysPressed.up = false;
      break;
    case "ArrowDown":
      keysPressed.down = false;
      break;
    case "ArrowLeft":
      keysPressed.left = false;
      break;
    case "ArrowRight":
      keysPressed.right = false;
      break;
    case " ":
      isDigging = false;
      //   lastAct = null;
      break;
    default:
      break;
  }
});
//Results Screen Game Reset
resetBtn.addEventListener("click", () => {
  if (lostGame) {
    lostGame = false;
    resultsText.style.zIndex = -1;
    resetBtn.style.zIndex = -1;
    scoreDiv.innerText = "00";
    meat.locations = [];
  }
  if (wonGame) {
    wonGame = false;
    resultsText.style.zIndex = -1;
    resetBtn.style.zIndex = -1;
  }
  shuffleTreasurePositions();
  meat.hide();
  music.currentTime = 0;
  music.play();
  animate();
});

funk();
