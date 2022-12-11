//Game NOT IMPLEMENTED YET
class Game {
  static tickRate = 1 / 240;
  static tilesPerSec = 10;
  static roundDuration = 60 * 1000;
  static distThresholds = {
    close: 50,
    far: 400,
  };
  static winningText = "YOU WON!!! CLICK BELOW TO GO AGAIN!!";
  static losingText = "TIMES UP!!! CLICK BELOW TO GO AGAIN!!";
  constructor({}) {
    //independent instance properties
    this.started = false;
    this.won = false;
    this.lost = false;
    //dependent properties
  }

}
class Sprite {
  constructor({ pos, image, actions = null, frames = { total: 1 } }) {
    this.pos = pos;
    this.image = image;
    this.actions = actions;
    this.frames = { ...frames, current: 0, elapsed: 0 };
    //multiplier sets how many tiles you move per second
    this.vel = tilesPerSec * tileSize * frameRate;
  }
  draw() {
    if (!lastAct) {
      this.image.src = this.actions.init;
      c.drawImage(this.image, this.pos.x, this.pos.y);
    } else {
      this.image.src = this.actions[lastAct];
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
      if (!isMoving && !isDigging && !isFinding) this.frames.current = 0;
      else {
        this.frames.elapsed++;
        if (this.frames.elapsed % this.frames.wait === 0) {
          if (this.frames.current < this.frames.total - 1)
            this.frames.current++;
          else this.frames.current = 0;
          if (this.frames.elapsed % (this.frames.wait * 12) === 0)
            isFinding = false;
        }
      }
    }
  }
}
class Scene {
  constructor({ pos, image }) {
    this.pos = pos;
    this.image = image;
  }
  draw() {
    c.drawImage(this.image, this.pos.x, this.pos.y);
  }
}
class Boundary {
  constructor(pos) {
    this.pos = pos;
  }
  draw() {
    c.fillStyle = "rgba(255, 0, 0, .4)";
    c.fillRect(this.pos.x, this.pos.y, tileSize, tileSize);
  }
}

class Treasure {
  constructor(image) {
    this.pos = { x: 0, y: 0 };
    this.image = image;
    this.locations = new Array();
  }
  hide() {
    //grab location option from the array
    const theSpot = this.locations.pop();
    this.pos = { x: theSpot[0] * tileSize, y: theSpot[1] * tileSize };
  }
  draw() {
    if (isFinding) {
      const guyCopy = { ...guy };
      c.drawImage(this.image, guyCopy.pos.x, guyCopy.pos.y - tileSize);
    }
  }
  found() {
    //increment score
    const scoreDiv = document.getElementById("score");
    const currentScore = parseInt(scoreDiv.innerText);
    scoreDiv.innerText =
      currentScore < 9 ? `0${currentScore + 1}` : `${currentScore + 1}`;
    isFinding = true;
    lastAct = "found";
    guy.frames.elapsed = 0;
    //hide in new spot if there is still treasure locations, else win game
    if (this.locations.length >= 1) this.hide();
    else wonGame = true;
  }
}
