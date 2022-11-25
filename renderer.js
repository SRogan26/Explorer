document.getElementById(
  "info"
).innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`;
const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

canvas.width = 1080;
canvas.height = 720;

function isColliding(rect1, rect2) {
  // if(rect1.pos.x<0)console.log('OOB')
  return (
    rect1.pos.x + tileSize > rect2.pos.x &&
    rect1.pos.x < rect2.pos.x + tileSize &&
    rect1.pos.y + tileSize > rect2.pos.y &&
    rect1.pos.y < rect2.pos.y + tileSize
  );
}
//
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
        console.log("top bump");
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
        console.log("bot bump");
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
        console.log("left bump");
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
        console.log("right bump");
        moveRight = false;
        break;
      }
    }
    if (moveRight) guy.pos.x += guy.vel;
  }
}

function animate() {
  if (Object.entries(keysPressed).filter((key) => key[1] === true).length > 0)
    isMoving = true;
  else isMoving = false;
  boundaries.forEach((boundary) => isColliding(guy, boundary));
  updatePosition();
  background.draw();
  guy.draw();
  towerPlatform.draw();
  foreground.draw();
  boundaries.forEach((boundary) => boundary.draw());
  window.requestAnimationFrame(animate);
}

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      keysPressed.up = true;
      lastKey = "up";
      break;
    case "ArrowDown":
      keysPressed.down = true;
      lastKey = "down";
      break;
    case "ArrowLeft":
      keysPressed.left = true;
      lastKey = "left";
      break;
    case "ArrowRight":
      keysPressed.right = true;
      lastKey = "right";
      break;
    case " ":
      console.log(e.key);
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
      console.log(e.key);
      break;
    default:
      break;
  }
});

const funk = async () => {
  const res = await window.versions.ping();
  console.log(res);
};

funk();

animate();
