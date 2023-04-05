import { getCactusRects, setupCactus, updateCactus } from "./cactus.js";
import { getDinoRect, setDinoLose, setupDino, updateDino } from "./dino.js";
import { setupGround, updateGround } from "./ground.js";

const WORLD_WIDTH = 100;
const WORLD_HEIGHT = 30;
const SPEED_SCALE_INCREASE = 0.00001;

const worldElem = document.querySelector("[data-world]");
const scoreElem = document.querySelector("[data-score]");
const startScreenElem = document.querySelector("[data-start-screen]");

setPixelToWorldScale();
window.addEventListener("resize", setPixelToWorldScale);
window.addEventListener("keydown", handleStart, { once: true });

let previousTime;
let speedScale;
let score;
function update(time) {
  if (previousTime == null) {
    previousTime = time;
    window.requestAnimationFrame(update);
    return;
  }
  const delta = time - previousTime;
  previousTime = time;

  updateGround(delta, speedScale);
  updateSpeedScale(delta);
  updateScore(delta);
  updateDino(delta, speedScale);
  updateCactus(delta, speedScale);

  if (isLose()) {
    handleLose();
    return;
  }

  window.requestAnimationFrame(update);
}

function isLose() {
  const dinoRect = getDinoRect();

  return getCactusRects().some((cactusRect) =>
    isCollision(dinoRect, cactusRect)
  );
}

function isCollision(rect1, rect2) {
  return (
    rect1.left <= rect2.right &&
    rect1.right >= rect2.left &&
    rect1.top <= rect2.bottom &&
    rect1.bottom >= rect2.top
  );
}

function updateSpeedScale(delta) {
  speedScale += delta * SPEED_SCALE_INCREASE;
}

function updateScore(delta) {
  score += delta * 0.01;
  scoreElem.textContent = Math.floor(score);
}

function handleStart() {
  previousTime = null;
  speedScale = 1;
  score = 0;
  startScreenElem.classList.add("hide");
  setupGround();
  window.requestAnimationFrame(update);
  setupDino();
  setupCactus();
}

function handleLose() {
  setDinoLose();
  setTimeout(() => {
    startScreenElem.classList.remove("hide");
    window.addEventListener("keydown", handleStart, { once: true });
  }, 500);
}

// scale the game on fixed height width ratio based on windwo width and height
function setPixelToWorldScale() {
  let worldToPixelScale;
  if (window.innerWidth / window.innerHeight < WORLD_WIDTH / WORLD_HEIGHT) {
    worldToPixelScale = window.innerWidth / WORLD_WIDTH;
  } else {
    worldToPixelScale = window.innerHeight / WORLD_HEIGHT;
  }

  worldElem.style.width = `${WORLD_WIDTH * worldToPixelScale}px`;
  worldElem.style.height = `${WORLD_HEIGHT * worldToPixelScale}px`;
}
