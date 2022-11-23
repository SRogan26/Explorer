document.getElementById(
  "info"
).innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`;
const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

canvas.width = 1080;
canvas.height = 720;

c.fillStyle = "black";
c.fillRect(0, 0, 1280, 720);

const tileSize = 24;

class Sprite {
  constructor({ pos, image }) {
    this.pos = pos;
    this.image = image;
    this.vel = tileSize / 2;
  }
  draw() {
    c.drawImage(this.image, this.pos.x, this.pos.y);
  }
}

const backgroundImg = new Image();
backgroundImg.src = "./img/PracticeProject.png";

const guyImg = new Image();
guyImg.src = "./img/PracticeGuy.png";
const foregroundImg = new Image();
foregroundImg.src = "./img/PracticeForeground.png";

const background = new Sprite({
  pos: { x: 0, y: 0 },
  image: backgroundImg,
});
const guy = new Sprite({
  pos: { x: tileSize * 22, y: tileSize * 15 },
  image: guyImg,
});
const foreground = new Sprite({
    pos: { x: 0, y: 0 },
    image: foregroundImg,
  });

function animate() {
  background.draw();
  guy.draw();
  foreground.draw();
  window.requestAnimationFrame(animate);
}

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      guy.pos.y -= guy.vel;
      break;
    case "ArrowDown":
      guy.pos.y += guy.vel;
      break;
    case "ArrowLeft":
      guy.pos.x -= guy.vel;
      break;
    case "ArrowRight":
      guy.pos.x += guy.vel;
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
