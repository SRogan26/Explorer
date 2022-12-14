//create collisions map and instantiate boundaries
let collisionsMap = [];
let waterMap = [];
let buildingsMap = [];
let searchableTilesGrid = [];

//audio?
const titleMusic = new Audio('audio/music/GoodTime.ogg')
titleMusic.volume = .7;
const findSfx = new Audio('audio/fx/Gold1.wav')
const missSfx = new Audio('./audio/fx/Menu4.wav')
const bumpSfx = new Audio('./audio/fx/Hit.wav')
bumpSfx.volume = .45;
const gameOver = new Audio('./audio/music/GameOver2.wav')

//meat set up
const meatImg = new Image();
meatImg.src = "./img/treasure/practiceMeat.png";
const meat = new Treasure(meatImg, findSfx);
//Grabs the coordinates of the treasure randomly
function chooseRandomPosition(copyOfSearchables) {
  const randIndex = Math.floor(Math.random() * copyOfSearchables.length);
  const option = copyOfSearchables.splice(randIndex, 1);
  return option[0];
}
function shuffleTreasurePositions() {
  const copyOfSearchables = [...searchableTilesGrid];
  while (copyOfSearchables.length > 0) {
    const meatPos = chooseRandomPosition(copyOfSearchables);
    meat.locations.push(meatPos);
  }
  console.log(
    "All locations set: ",
    meat.locations.length === searchableTilesGrid.length
  );
}
//scene set up
function createLevelObj(levelName) {
  //create scene
  const bgObj = new Image();
  bgObj.src = `./img/scene/${levelName}/${levelName}Background.png`;
  const fgObj = new Image();
  fgObj.src = `./img/scene/${levelName}/${levelName}Foreground.png`;
  const audioObj = new Audio(`audio/music/${levelName}/${levelName}.mp3`)
  //set level data
  collisionsMap = [];
  waterMap = [];
  buildingsMap = [];
  searchableTilesGrid = [];

  for (i = 0; i < mapData[levelName].water.length; i += columns) {
    waterMap.push(mapData[levelName].water.slice(i, i + columns));
    buildingsMap.push(mapData[levelName].buildings.slice(i, i + columns));
  }
  
  for (i = 0; i < mapData[levelName].collisions.length; i += columns) {
    collisionsMap.push(mapData[levelName].collisions.slice(i, i + columns));
  }
  
  for (y = 0; y < collisionsMap.length; y++) {
    for (x = 0; x < collisionsMap[y].length; x++) {
      if (waterMap[y][x] + buildingsMap[y][x] + collisionsMap[y][x] === 0)
      searchableTilesGrid.push([x, y]);
    }
  }
  shuffleTreasurePositions();
  return new Level({
    pos: { x: 0, y: 0 },
    background: bgObj,
    foreground: fgObj,
    audio: audioObj
  });
}
//character set up
function createCharacterObj(character){
  const charImg = new Image();
  const charPos = chooseRandomPosition([...searchableTilesGrid]);
  return new Sprite({
    pos: { x: tileSize * charPos[0], y: tileSize * charPos[1] },
    image: charImg,
    actions: {
      init: `./img/char/${character}/${character}Init.png`,
      up: `./img/char/${character}/${character}Up.png`,
      down: `./img/char/${character}/${character}Down.png`,
      left: `./img/char/${character}/${character}Left.png`,
      right: `./img/char/${character}/${character}Right.png`,
      dig: `./img/char/${character}/${character}Dig.png`,
      found: `./img/char/${character}/${character}Found.png`,
    },
    frames: {
      //total sprites in the sprite sheet
      total: 4,
      //amount of time in seconds before switching frames in the sprite sheet
      wait: 1/5,
    },
  });
}