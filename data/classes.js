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
    c.drawImage(this.image, this.pos.x, this.pos.y);
  }
  found() {
    //increment score
    const scoreDiv = document.getElementById("score");
    const currentScore = parseInt(scoreDiv.innerText);
    scoreDiv.innerText = `0${currentScore + 1}`;
    //hide in new spot if there is still treasure locations, else win game
    if (this.locations.length >= 1) this.hide();
    else wonGame = true;
  }
}
