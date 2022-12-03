document.getElementById(
  "info"
).innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`;
const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

canvas.width = 1080;
canvas.height = 720;

const scoreDiv = document.getElementById("score");
scoreDiv.innerText = "00";

const heatGauge = document.getElementById("merc");

const resultsText = document.getElementById("results");
const resetBtn = document.getElementById("reset");

resetBtn.addEventListener("click", () => {
  if (wonGame) {
    wonGame = false;
    resultsText.style.zIndex = -1;
    resetBtn.style.zIndex = -1;
    for (i = 0; i < totalMeats; i++) {
      const meatPos = chooseTreasurePosition();
      meat.locations.push(meatPos);
    }
    meat.hide();
    animate();
  }
});

function checkDist() {
  //pythagorean theorem
  const a = guy.pos.x - meat.pos.x;
  const b = guy.pos.y - meat.pos.y;
  const c2 = a * a + b * b;
  return c2;
}
//Takes square of distance and compares to square of distance thresholds
function adjustHeat(distSQ) {
  const closeSQ = distThresholds.close * distThresholds.close;
  const farSQ = distThresholds.far * distThresholds.far;
  if (distSQ < closeSQ) {
    heatGauge.style.backgroundColor = `rgb(255, 0, 0)`;
    heatGauge.style.height = "100%";
  } else if (distSQ > closeSQ && distSQ < farSQ) {
    const distRange = farSQ - closeSQ;
    const meterHeight = 100 * (Math.abs(distSQ - distRange) / distRange);
    const colorMod = Math.floor(
      255 * (Math.abs(distSQ - distRange) / distRange)
    );
    const redVal = colorMod;
    const blueVal = 255 - colorMod;
    let grnVal;
    if(blueVal > redVal) grnVal = colorMod;
    else grnVal = 255 - colorMod * .5;
    heatGauge.style.backgroundColor = `rgb(${redVal}, ${grnVal}, ${blueVal})`;
    heatGauge.style.height = `${meterHeight}%`;
  } else if (distSQ > farSQ) {
    heatGauge.style.backgroundColor = `rgb(0, 0, 255)`;
    heatGauge.style.height = "15%";
  }
}
function isColliding(rect1, rect2) {
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
function drawScene() {
  background.draw();
  guy.draw();
  towerPlatform.draw();
  foreground.draw();
  // meat.draw();
}
function animate() {
  if (Object.entries(keysPressed).filter((key) => key[1] === true).length > 0)
    isMoving = true;
  else isMoving = false;
  boundaries.forEach((boundary) => isColliding(guy, boundary));
  updatePosition();
  adjustHeat(checkDist());
  drawScene();
  if (wonGame) {
    resultsText.innerText = winningText;
    resultsText.style.zIndex = 3;
    resetBtn.style.zIndex = 4;
  } else window.requestAnimationFrame(animate);
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
      if (isColliding(guy, meat)) meat.found();
      else console.log("miss");
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
    // case " ":
    //   console.log(e.key);
    //   break;
    default:
      break;
  }
});

const funk = async () => {
  const res = await window.versions.ping();
  console.log(res);
};

funk();
meat.hide();
animate();
