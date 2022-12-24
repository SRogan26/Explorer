//Global
let timeLeftms;
let animID;
const tileSize = 24;
const columns = 45;
const rows = 30;
let lastAct = "";
let isMoving;
let isDigging;
let isFinding;
const keysPressed = {
  up: false,
  down: false,
  left: false,
  right: false,
};
const musicVolume = {
  min: 0.24,
  max: 0.8,
};
const volRange = musicVolume.max - musicVolume.min;
const totalMeats = 5;
//Game static
//nTick increases logical tickRate, DO NOT SET THIS HIGHER THAN 5
const nTick = 2;
const tickRate = (1 / 60) * Math.pow(1 / 2, nTick);
//frame draw rate
const frameRate = 1 / 120;
const tilesPerSec = 10;
const roundDuration = 60 * 1000;
const distThresholds = {
  close: 50,
  far: 400,
};
const winningText = "YOU WON!!! CLICK TO GO AGAIN!!";
const losingText = "TIMES UP!!! CLICK BELOW TO TRY AGAIN!!";

const characters = [
  { guy: "SAMURAI" },
  { frog: "FROG NINJA" },
  { spy: "AGENT C." },
  { dog: "INU NINGEN" },
];

const levels = [
  {practice: 'PENINSULA'},
  {level2: 'ISLAND LEVEL'}
]

//Game flags
let selectingChar = false;
let selectingLevel = true;
let gameStarted = false;
let wonGame = false;
let lostGame = false;
