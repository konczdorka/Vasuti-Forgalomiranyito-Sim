import { GameModel } from "./state.js";
import { renderMenu, renderHUD, renderCanvas } from "./render.js";

const gameModel = new GameModel();

// DOM elemek
const menuScreen = document.querySelector("#menu-screen");
const gameScreen = document.querySelector("#game-screen");
const canvas = document.querySelector("#game-canvas");
const ctx = canvas.getContext("2d");

const nameInput = document.querySelector("#name-entry");
const diffSelect = document.querySelector("#diffSelect");
const startBtn = document.querySelector("#start-button");
const menuLoadBtn = document.querySelector("#menu-load-button");

const resumeStopBtn = document.querySelector("#resume-stop-button");
const resetBtn = document.querySelector("#reset-button");
const saveBtn = document.querySelector("#save-button");
const loadBtn = document.querySelector("#load-button");
const backToMenuBtn = document.querySelector("#back-to-menu");

const modalOverlay = document.querySelector("#modal-overlay");
const modalTitle = document.querySelector("#modal-title");
const modalMessage = document.querySelector("#modal-message");
const modalCloseBtn = document.querySelector("#modal-close-btn");

let lastTimestamp = 0;
let hasRecordedScore = false; //dicslista spam ellen

function getLeaderboard() {
  try {
    return (
      JSON.parse(localStorage.getItem("train_simulator_leaderboard")) || []
    );
  } catch (e) {
    return [];
  }
}

function saveLeaderboardEntry(entry) {
  const list = getLeaderboard();
  list.push(entry);
  list.sort((a, b) => a.fails - b.fails || a.rawTime - b.rawTime);
  localStorage.setItem("train_simulator_leaderboard", JSON.stringify(list));
}

renderMenu(menuScreen, getLeaderboard());

startBtn.addEventListener("click", () => {
  const name = nameInput.value.trim();
  if (!name) {
    nameInput.style.border = "2px solid #ef4444";
    return;
  }
  nameInput.style.border = "1px solid #4a5078";

  hasRecordedScore = false;
  gameModel.initLevel(diffSelect.value, name);
  showGameScreen();
});

menuLoadBtn.addEventListener("click", () => {
  const savedData = localStorage.getItem("train_simulator_save");
  if (savedData && gameModel.importState(savedData)) {
    hasRecordedScore = false;
    showGameScreen();
  } else {
    showModal("Hiba", "Nincs elmentett játékállás vagy sérült a mentés!");
  }
});

resumeStopBtn.addEventListener("click", () => {
  gameModel.isPaused = !gameModel.isPaused;
  resumeStopBtn.textContent = gameModel.isPaused ? "Folytatás" : "Szünet";
});

resetBtn.addEventListener("click", () => {
  hasRecordedScore = false;
  gameModel.initLevel(gameModel.currentLevelId, gameModel.playerName);
});

saveBtn.addEventListener("click", () => {
  localStorage.setItem("train_simulator_save", gameModel.exportState());
  showModal(
    "Mentés",
    "A játékállás sikeresen elmentve a böngésző helyi tárhelyére!",
  );
});

loadBtn.addEventListener("click", () => {
  const savedData = localStorage.getItem("train_simulator_save");
  if (savedData && gameModel.importState(savedData)) {
    hasRecordedScore = false;
    showModal("Betöltés", "Játékállás sikeresen betöltve!");
  } else {
    showModal("Hiba", "Sikertelen betöltés!");
  }
});

backToMenuBtn.addEventListener("click", () => {
  gameScreen.classList.add("hidden");
  menuScreen.classList.remove("hidden");
  renderMenu(menuScreen, getLeaderboard());
});

modalCloseBtn.addEventListener("click", () => {
  modalOverlay.classList.add("hidden");
});

function getCanvasCoordinates(e) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY,
  };
}

canvas.addEventListener("click", (e) => {
  if (gameModel.isPaused || gameModel.isGameOver || gameModel.isVictory) return;

  const { x, y } = getCanvasCoordinates(e);
  const { nodes, paths } = gameModel.levelConfig;

  for (const sw of gameModel.switches) {
    const node = nodes[sw.node];
    if (Math.hypot(x - node.x, y - node.y) <= 25) {
      gameModel.toggleSwitch(sw.id);
      return;
    }
  }

  for (const lamp of gameModel.lamps) {
    const path = paths.find((p) => p.id === lamp.path);
    const fn = nodes[path.from];
    const tn = nodes[path.to];
    const lx = fn.x + (tn.x - fn.x) * lamp.posRatio;
    const ly = fn.y + (tn.y - fn.y) * lamp.posRatio;

    if (Math.hypot(x - lx, y - ly) <= 25) {
      gameModel.toggleLamp(lamp.id);
      return;
    }
  }
});

canvas.addEventListener("contextmenu", (e) => {
  e.preventDefault();

  if (gameModel.isPaused || gameModel.isGameOver || gameModel.isVictory) return;

  const { x, y } = getCanvasCoordinates(e);

  for (const train of gameModel.trains) {
    if (Math.hypot(x - train.x, y - train.y) <= 28) {
      gameModel.toggleTrainBrake(train.id);
      return;
    }
  }
});

function showModal(title, msg) {
  modalTitle.textContent = title;
  modalMessage.textContent = msg;
  modalOverlay.classList.remove("hidden");
}

function showGameScreen() {
  menuScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  resumeStopBtn.textContent = "Szünet";
}

function gameLoop(timestamp) {
  if (!lastTimestamp) lastTimestamp = timestamp;
  const dt = Math.min((timestamp - lastTimestamp) / 1000, 0.1);
  lastTimestamp = timestamp;

  gameModel.update(dt);

  if (gameModel.isGameOver) {
    if (!hasRecordedScore) {
      hasRecordedScore = true;
      showModal(
        "Katasztrófa / Game Over",
        "Baleset történt a pályán (ütközés vagy kisiklás)! Próbáld újra.",
      );
    }
  } else if (gameModel.isVictory) {
    if (!hasRecordedScore) {
      hasRecordedScore = true;
      const mins = String(Math.floor(gameModel.elapsedTime / 60)).padStart(
        2,
        "0",
      );
      const secs = String(Math.floor(gameModel.elapsedTime % 60)).padStart(
        2,
        "0",
      );

      saveLeaderboardEntry({
        name: gameModel.playerName,
        level: gameModel.levelConfig.name,
        time: `${mins}:${secs}`,
        rawTime: gameModel.elapsedTime,
        fails: gameModel.failCount,
        date: new Date().toLocaleDateString("hu-HU"),
      });

      showModal(
        "Sikeres küldetés!",
        `Minden szerelvény feldolgozva! Menetidő: ${mins}:${secs}, Hibapontok: ${gameModel.failCount}`,
      );
    }
  }

  renderHUD(gameScreen, gameModel);
  renderCanvas(ctx, gameModel);

  window.requestAnimationFrame(gameLoop);
}

window.requestAnimationFrame(gameLoop);
