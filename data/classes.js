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
    c.fillRect(
      this.pos.x,
      this.pos.y,
      tileSize,
      tileSize
    );
  }
}
