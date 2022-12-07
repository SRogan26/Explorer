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
const backgroundImg = new Image();
backgroundImg.src = "./img/scene/PracticeProject.png";
const towerPlatImg = new Image();
towerPlatImg.src = "./img/scene/towerPlat.png";
const foregroundImg = new Image();
foregroundImg.src = "./img/scene/PracticeForeground.png";

const background = new Scene({
  pos: { x: 0, y: 0 },
  image: backgroundImg,
});
const towerPlatform = new Scene({
  pos: { x: 0, y: 0 },
  image: towerPlatImg,
});
const foreground = new Scene({
  pos: { x: 0, y: 0 },
  image: foregroundImg,
});

//character set up
const guyImg = new Image();
const guyPos = chooseRandomPosition([...searchableTilesGrid]);
const guy = new Sprite({
  pos: { x: tileSize * guyPos[0], y: tileSize * guyPos[1] },
  image: guyImg,
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
    wait: Math.round((1/frameRate)/5),
  },
});

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
  const copyOfSearchables = [...searchableTilesGrid]
  while (copyOfSearchables.length > 0) {
    const meatPos = chooseRandomPosition(copyOfSearchables);
    meat.locations.push(meatPos);
  }
  console.log('All locations set: ', meat.locations.length === searchableTilesGrid.length)
}
shuffleTreasurePositions();