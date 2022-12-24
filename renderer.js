document.getElementById(
  "info"
).innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`;
const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");
let lastTime;
let tickAccumulator = 0;
let frameAcc = 0;
let startTime;
//Reference for character and level
let guy;
let stage;
const screens = {
  char: 2,
  start: 3,
  game: 4,
  end: 5,
  level: 6,
};

canvas.width = columns * tileSize;
canvas.height = rows * tileSize;

const scoreDiv = document.getElementById("score");
scoreDiv.innerText = "00";

const heatGauge = document.getElementById("merc");

const charSelScreen = document.getElementById("charselect");
const charList = charSelScreen.getElementsByTagName("ul")[0].children;
const startScreen = document.getElementById("start");
const endScreen = document.getElementById("end");
const levelSelScreen = document.getElementById("levelselect");
const levelList = levelSelScreen.getElementsByTagName("ul")[0].children;

const resultsText = document.getElementById("results");
const resetBtn = document.getElementById("reset");
const changeBtn = document.getElementById("toCharSelect");

//creates list items for a character choice and  level choice objects
function createCharChoice(character) {
  const charChoice = document.createElement("li");
  const charId = Object.keys(character)[0];
  const charName = Object.values(character)[0];
  charChoice.dataset.name = charId;
  charChoice.innerText = charName;
  const charImg = new Image();
  charImg.dataset.name = charId;
  charImg.src = `./img/char/${charId}/${charId}Face.png`;
  charChoice.prepend(charImg);
  return charChoice;
}
function createLevelChoice(level){
  const levelChoice = document.createElement("li");
  const levelId = Object.keys(level)[0];
  const levelName = Object.values(level)[0];
  levelChoice.dataset.name = levelId;
  levelChoice.innerText = levelName;
  const levelImg = new Image();
  levelImg.dataset.name = levelId;
  levelImg.src = `./img/scene/${levelId}/${levelId}Background.png`;
  levelChoice.prepend(levelImg);
  return levelChoice;
}
//populate character select and level select lists
for (p = 0; p < characters.length; p++) {
  const charItem = createCharChoice(characters[p]);
  charSelScreen.getElementsByTagName("ul")[0].appendChild(charItem);
}
for (l = 0; l < levels.length; l++) {
  const levelItem = createLevelChoice(levels[l]);
  levelSelScreen.getElementsByTagName("ul")[0].appendChild(levelItem);
}


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
    stage.music.volume = musicVolume.max;
    heatGauge.style.backgroundColor = `rgb(255, 0, 0)`;
    heatGauge.style.height = "100%";
  } else if (distSQ > closeSQ && distSQ < farSQ) {
    const distRange = farSQ - closeSQ;
    const meterHeight = 100 * (Math.abs(distSQ - distRange) / distRange);
    stage.music.volume = 0.24 + (meterHeight * volRange) / 100;
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
    stage.music.volume = musicVolume.min;
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
function drawScene(current, previous) {
  frameAcc += (current - previous) / 1000;
  while (frameAcc > frameRate) {
    stage.drawBg();
    guy.draw();
    stage.drawFg();
    meat.draw();
    adjustHeat(checkDist());
    frameAcc -= frameRate;
  }
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
function setMusicIntensity() {
  if (timeLeftms <= 10000) stage.music.playbackRate = 1.2;
  else stage.music.playbackRate = 1;
}
//calculation rate setter
function logicTick(current, previous) {
  tickAccumulator += (current - previous) / 1000;
  while (tickAccumulator > tickRate) {
    boundaries.forEach((boundary) => isColliding(guy, boundary));
    updatePosition();
    tickAccumulator -= tickRate;
  }
}
//Foreground Screen Setter
function setActiveScreen(screen) {
  switch (screen) {
    case screens.char:
      charSelScreen.style.zIndex = 3;
      startScreen.style.zIndex = -1;
      canvas.style.zIndex = -1;
      endScreen.style.zIndex = -1;
      levelSelScreen.style.zIndex = -1;
      break;
    case screens.start:
      startScreen.style.zIndex = 3;
      canvas.style.zIndex = -1;
      charSelScreen.style.zIndex = -1;
      endScreen.style.zIndex = -1;
      levelSelScreen.style.zIndex = -1;
      break;
    case screens.game:
      canvas.style.zIndex = 3;
      startScreen.style.zIndex = -1;
      charSelScreen.style.zIndex = -1;
      endScreen.style.zIndex = -1;
      levelSelScreen.style.zIndex = -1;
      break;
    case screens.end:
      endScreen.style.zIndex = 3;
      startScreen.style.zIndex = -1;
      canvas.style.zIndex = -1;
      charSelScreen.style.zIndex = -1;
      levelSelScreen.style.zIndex = -1;
      break;
    case screens.level:
      levelSelScreen.style.zIndex = 3;
      endScreen.style.zIndex = -1;
      startScreen.style.zIndex = -1;
      canvas.style.zIndex = -1;
      charSelScreen.style.zIndex = -1;
      break;
  }
}
//Results Screens Triggers
function showLoseScreen() {
  cancelAnimationFrame(animID);
  stage.music.pause();
  gameOver.play();
  lostGame = true;
  startTime = null;
  resultsText.innerText = losingText;
  setActiveScreen(screens.end);
}
function showWinScreen() {
  cancelAnimationFrame(animID);
  startTime = null;
  resultsText.innerText = winningText;
  setActiveScreen(screens.end);
}
//game loop
function animate(timestamp) {
  if (stage.music.ended) stage.music.play();
  if (!lastTime) lastTime = timestamp;
  if (!startTime) startTime = timestamp;
  //in game timer value
  setTimerValue(performance.now(), startTime);
  setMusicIntensity();
  //check to see if any movement keys are pressed
  if (Object.entries(keysPressed).filter((key) => key[1] === true).length > 0)
    isMoving = true;
  else isMoving = false;
  //frame rate limiter loop, should help keep game Tick rate at 60 calcs per sec
  if (lastTime) logicTick(performance.now(), lastTime);
  if (lastTime) drawScene(performance.now(), lastTime);
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
  titleMusic.pause();
  stage.music.play();
  setActiveScreen(screens.game);
  meat.hide();
  animate();
}
//function to control digging action
function dig() {
  lastAct = "dig";
  isDigging = true;
  for (let key in keysPressed) keysPressed[key] = false;
  if (isColliding(guy, meat)) meat.found();
  else if (!wonGame && !lostGame) missSfx.play();
}
//example of ipc
const funk = async () => {
  const res = await window.versions.ping();
  console.log(res);
};
//EVENT LISTENERS
//Title Screen
titleMusic.addEventListener("canplay", () => {
  if (!gameStarted) titleMusic.play();
});
titleMusic.addEventListener("ended", () => {
  if (!gameStarted) {
    titleMusic.currentTime = 0;
    titleMusic.play();
  }
});
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
      if (!gameStarted && !selectingChar && !selectingLevel) gameStart();
      else dig();
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
      break;
    default:
      break;
  }
});
//Results Screen Game Reset
resetBtn.addEventListener("click", () => {
  if (lostGame) {
    lostGame = false;
    gameStarted = false;
    setActiveScreen(screens.start);
    scoreDiv.innerText = "00";
    meat.locations = [];
  }
  if (wonGame) {
    wonGame = false;
    gameStarted = false;
    setActiveScreen(screens.start);
  }
  shuffleTreasurePositions();
  stage.music.currentTime = 0;
});
//Character select listeners
changeBtn.addEventListener("click", () => {
  selectingLevel = true;
  gameStarted = false;
  wonGame = false;
  lostGame = false;
  scoreDiv.innerText = "00";
  stage.music.currentTime = 0;
  titleMusic.currentTime = 0;
  titleMusic.play();
  setActiveScreen(screens.level);
});
for (g = 0; g < charList.length; g++) {
  charList[g].addEventListener("click", (e) => {
    selectingChar = false;
    const charName = e.target.dataset.name;
    guy = createCharacterObj(charName);
    setActiveScreen(screens.start);
  });
}
//level select listeners
for (g = 0; g < levelList.length; g++) {
  levelList[g].addEventListener("click", (e) => {
    selectingLevel = false;
    selectingChar = true;
    const levelName = e.target.dataset.name;
    stage = createLevelObj(levelName);
    setActiveScreen(screens.char);
  });
}

funk();
setActiveScreen(screens.level);
setTimerValue(0, 0);
