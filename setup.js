//create collisions map and instantiate boundaries
let collisionsMap = [];

for (i = 0; i < collisions.length ; i += columns) {
  collisionsMap.push(collisions.slice(i, i + columns));
}
console.log(collisionsMap);

let boundaries = [];

for(y=0; y < collisionsMap.length; y++){
  for(x=0; x< collisionsMap[y].length; x++){
    if(collisionsMap[y][x] !== 0) boundaries.push(new Boundary({x: x * tileSize,y: y * tileSize}))
  }
}
console.log(boundaries)
//scene set up
const backgroundImg = new Image();
backgroundImg.src = "./img/scene/PracticeProject.png";
const towerPlatImg = new Image();
towerPlatImg.src = "./img/scene/towerPlat.png";
const foregroundImg = new Image();
foregroundImg.src = "./img/scene/PracticeForeground.png";

const background = new Sprite({
  pos: { x: 0, y: 0 },
  image: backgroundImg,
});
const towerPlatform = new Sprite({
  pos: { x: 0, y: 0 },
  image: towerPlatImg,
});
const foreground = new Sprite({
  pos: { x: 0, y: 0 },
  image: foregroundImg,
});

//character set up
const guyImg = new Image();

const guy = new Sprite({
  pos: { x: tileSize * 18, y: tileSize * 15 },
  image: guyImg,
  actions: {
    init: "./img/char/PracticeGuy.png",
    up: "./img/char/guyUp.png",
    down: "./img/char/guyDown.png",
    left: "./img/char/guyLeft.png",
    right: "./img/char/guyRight.png",
  },
  frames: {
    total: 4,
    wait: 18,
  },
});
