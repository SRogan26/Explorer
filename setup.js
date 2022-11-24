const tileSize = 24;

const keysPressed = {
  up: false,
  down: false,
  left: false,
  right: false,
};

console.log(collisions);

let lastKey = "";
let isMoving;

class Sprite {
  constructor({ pos, image, actions = null, frames = { total: 1 } }) {
    this.pos = pos;
    this.image = image;
    this.actions = actions;
    this.frames = { ...frames, current: 0, elapsed: 0 };
    this.vel = tileSize / 8;
  }
  draw() {
    if (!this.actions) c.drawImage(this.image, this.pos.x, this.pos.y);
    else if (!lastKey) {
      this.image.src = this.actions.init;
      c.drawImage(this.image, this.pos.x, this.pos.y);
    } else {
      this.image.src = this.actions[lastKey];
      c.drawImage(
        this.image,
        tileSize * this.frames.current,
        0,
        tileSize,
        tileSize,
        this.pos.x,
        this.pos.y,
        tileSize,
        tileSize
      );
      if (!isMoving) this.frames.current = 0;
      else {
        this.frames.elapsed++;
        if (this.frames.elapsed % this.frames.wait === 0) {
          if (this.frames.current < this.frames.total - 1)
            this.frames.current++;
          else this.frames.current = 0;
        }
      }
    }
  }
}

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
