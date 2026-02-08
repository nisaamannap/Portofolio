/* ================== BASIC SETUP ================== */
const game = document.querySelector('.game');
const world = document.querySelector('.world');
const character = document.getElementById('character');
const charSprite = document.getElementById('charSprite');
const buildings = document.querySelectorAll('.building');
const finishFlag = document.getElementById('finishFlag');

const btnLeft = document.getElementById('left');
const btnRight = document.getElementById('right');

const infoPanel = document.getElementById('infoPanel');
const infoTitle = document.getElementById('infoTitle');
const infoCompany = document.getElementById('infoCompany');
const infoYear = document.getElementById('infoYear');

/* ================== DATA ================== */
const buildingData = {
  1: { title: "SPG", company: "PT Torabika Eka Semesta", year: "2020–2021" },
  2: { title: "Office Administrator", company: "PT Sulung Jaya Mandiri", year: "2021–2022" },
  3: { title: "Data Analyst", company: "PT Sarilling Aneka Energi", year: "2024" }
};

/* ================== SIZE Peta ======== */
const GAME_WIDTH = game.offsetWidth;
const WORLD_WIDTH = world.offsetWidth;
const CHAR_WIDTH = 80;
const SPEED = 3;

const CENTER_X = GAME_WIDTH / 2 - CHAR_WIDTH / 2;
const WORLD_MIN = -(WORLD_WIDTH - GAME_WIDTH);

/* ================== STATE ================== */
let charX = 10;
let worldX = 0;
let dir = 0;
let facing = 1;
let activeBuilding = null;

let isJumping = false;
let jumpY = 0;
let jumpV = 0;

/* ================== UTIL ================== */
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

/* ================== BUILDING POSITION ================== */
let pos = 1200;
buildings.forEach(b => {
  b.style.left = pos + 'px';
  pos += 1600;
});

/* ================== INPUT ================== */
btnLeft.onmousedown = () => { dir = -1; facing = -1; };
btnRight.onmousedown = () => { dir = 1; facing = 1; };
document.onmouseup = () => dir = 0;

btnLeft.ontouchstart = e => { e.preventDefault(); dir = -1; facing = -1; };
btnRight.ontouchstart = e => { e.preventDefault(); dir = 1; facing = 1; };
document.ontouchend = () => dir = 0;

/* ================== LOOP ================== */
function loop() {

  /* ===== MOVE ===== */
  if (dir !== 0) {
    if (
      (dir === 1 && worldX > WORLD_MIN) ||
      (dir === -1 && worldX < 0)
    ) {
      worldX -= dir * SPEED;
    } else {
      charX += dir * SPEED;
    }
  }

  /* ===== JUMP ===== */
  if (isJumping) {
    jumpY += jumpV;
    jumpV += 0.8;
    if (jumpY >= 0) {
      jumpY = 0;
      isJumping = false;
    }
  }

  charX = clamp(charX, 0, GAME_WIDTH - CHAR_WIDTH);
  worldX = clamp(worldX, WORLD_MIN, 0);

  /* ===== RENDER ===== */
  character.style.transform = `translate(${charX}px, ${jumpY}px)`;
  world.style.transform = `translateX(${worldX}px)`;
  charSprite.style.transform = `scaleX(${facing})`;

  checkBuilding();
  checkBehindBuilding();
  checkFinish();

  requestAnimationFrame(loop);
}

loop();

/* ================== INFO PANEL ================== */
function checkBuilding() {
  const center = charX + CHAR_WIDTH / 2;
  let found = null;

  buildings.forEach(b => {
    const id = b.dataset.id;
    const left = b.offsetLeft + worldX;
    const right = left + b.offsetWidth;

    if (center > left && center < right) found = id;
  });

  if (found && found !== activeBuilding) {
    activeBuilding = found;
    infoTitle.textContent = buildingData[found].title;
    infoCompany.textContent = buildingData[found].company;
    infoYear.textContent = buildingData[found].year;
    infoPanel.classList.add('show');
  }

  if (!found && activeBuilding) {
    activeBuilding = null;
    infoPanel.classList.remove('show');
  }
}

/* ================== BEHIND BUILDING ================== */
function checkBehindBuilding() {
  const center = charX + CHAR_WIDTH / 2;
  let behind = false;

  buildings.forEach(b => {
    const left = b.offsetLeft + worldX;
    const right = left + b.offsetWidth;
    if (center > left && center < right) behind = true;
  });

  character.style.zIndex = behind ? 1 : 5;
}

/* ================== FINISH FLAG ================== */
function checkFinish() {
  if (!finishFlag) return;

  const left = finishFlag.offsetLeft + worldX;
  const right = left + finishFlag.offsetWidth;
  const center = charX + CHAR_WIDTH / 2;

  if (center > left && center < right && !isJumping) {
    isJumping = true;
    jumpV = -14;
  }
}
