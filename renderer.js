document.getElementById(
  "info"
).innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`;
const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

canvas.width = 1080;
canvas.height = 720;

c.fillStyle = "black";
c.fillRect(0, 0, 1280, 720);

function updatePosition() {
  if (keysPressed.up) guy.pos.y -= guy.vel;
  if (keysPressed.down) guy.pos.y += guy.vel;
  if (keysPressed.left) guy.pos.x -= guy.vel;
  if (keysPressed.right) guy.pos.x += guy.vel;
}

function animate() {
  if(Object.entries(keysPressed).filter(key => key[1] === true).length > 0) isMoving = true
  else isMoving = false;
  updatePosition();
  background.draw();
  guy.draw();
  towerPlatform.draw();
  foreground.draw();
  window.requestAnimationFrame(animate);
}

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      keysPressed.up = true;
      lastKey = 'up'
      break;
    case "ArrowDown":
      keysPressed.down = true;
      lastKey = 'down'
      break;
    case "ArrowLeft":
      keysPressed.left = true;
      lastKey = 'left'
      break;
    case "ArrowRight":
      keysPressed.right = true;
      lastKey = 'right'
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
