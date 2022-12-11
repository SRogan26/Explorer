//create collisions map and instantiate boundaries
let collisionsMap = [];
let waterMap = [];
let buildingsMap = [];
let searchableTilesGrid = [];

for (i = 0; i < water.length; i += columns) {
  waterMap.push(water.slice(i, i + columns));
  buildingsMap.push(buildings.slice(i, i + columns));
}

for (i = 0; i < collisions.length; i += columns) {
  collisionsMap.push(collisions.slice(i, i + columns));
}

let boundaries = [];

for (y = 0; y < collisionsMap.length; y++) {
  for (x = 0; x < collisionsMap[y].length; x++) {
    if (collisionsMap[y][x] !== 0)
      boundaries.push(new Boundary({ x: x * tileSize, y: y * tileSize }));
    else if (waterMap[y][x] + buildingsMap[y][x] === 0)
      searchableTilesGrid.push([x, y]);
  }
}

//scene set up
function createSceneObj(src) {
  const imgObj = new Image();
  imgObj.src = src;
  return new Scene({
    pos: { x: 0, y: 0 },
    image: imgObj,
  });
}

const background = createSceneObj("./img/scene/PracticeProject.png");
const towerPlatform = createSceneObj("./img/scene/towerPlat.png");
const foreground = createSceneObj("./img/scene/PracticeForeground.png");

//character set up
function createCharacterObj(character){
  const charImg = new Image();
  const charPos = chooseRandomPosition([...searchableTilesGrid]);
  return new Sprite({
    pos: { x: tileSize * charPos[0], y: tileSize * charPos[1] },
    image: charImg,
    actions: character.actions,
    frames: character.frames,
  });
}

const guyData = {
  actions: {
    init: "./img/char/PracticeGuy.png",
    up: "./img/char/guyUp.png",
    down: "./img/char/guyDown.png",
    left: "./img/char/guyLeft.png",
    right: "./img/char/guyRight.png",
    dig: "./img/char/guyDig.png",
    found: "./img/char/guyFound.png",
  },
  frames: {
    total: 4,
    wait: Math.round(1 / frameRate / 4),
  },
}
const guy = createCharacterObj(guyData);

//meat set up
const meatImg = new Image();
meatImg.src = "./img/treasure/practiceMeat.png";

const meat = new Treasure(meatImg);
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
shuffleTreasurePositions();
