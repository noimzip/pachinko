const gameState = {
  score: 0,
  cps: 1,
  clicksPerSecond: 0,
  stats: { minutes: 0, hours: 0, totalClicks: 0, totalScore: 0 },
  settings: { autosave: false },
  boughtUpgrades: [],
  unlockedAchievements: []
};

// DOM management functions
function updateDOM() {
  try {
    const scoreCounter = document.getElementById("score-counter");
    if (!scoreCounter) throw new Error("score-counter Element not found");
    scoreCounter.textContent = `Score is ${gameState.score.toLocaleString()}`;
  } catch (error) {
    console.warn("DOM Update Error:", error.message);
  }
  try {
    const MainButtonClickedTimes = document.getElementById("main-button-clicked-times");
    if (!MainButtonClickedTimes) throw new Error("main-button-clicked-times Element not found");
    MainButtonClickedTimes.textContent = `Button clicks: ${gameState.stats.totalClicks.toLocaleString()}`;
  } catch (error) {
    console.warn("DOM Update Error:", error.message);
  }
  try {
    const TotalScore = document.getElementById("totalscore");
    if (!TotalScore) throw new Error("totalscore Element not found");
    TotalScore.textContent = `Total score: ${gameState.stats.totalScore.toLocaleString()}`;
  } catch (error) {
    console.warn("DOM Update Error:", error.message);
  }
  try {
    const PlayTime = document.getElementById("playtime");
    if (!PlayTime) throw new Error("playtime Element not found");
    PlayTime.textContent = `Playtime: ${gameState.stats.hours} hours, ${gameState.stats.minutes} minutes`;
  } catch (error) {
    console.warn("DOM Update Error:", error.message);
  }
}

function KeyboardShortcut(event, func, targetKey) {
  if (event.key === targetKey) {
    event.preventDefault();
    func();
  }
}

export class MainButtonModel {
  static gameDataProcess() {
    gameState.score += gameState.cps;
    gameState.stats.totalScore += gameState.cps;
    gameState.stats.totalClicks++;
    gameState.clicksPerSecond++;
  }
  resetCPS() {
    gameState.clicksPerSecond = 0;
  }
}

export class MainButtonView {
  #updateTextContent(elementId, text) {
    try {
      const element = document.getElementById(elementId);
      if (!element) throw new Error(`${elementId} Element not found`);
      element.textContent = text;
    } catch (error) {
      console.warn("DOM Update Error:", error.message);
    }
  }
  ApplyDOM() {
    this.#updateTextContent("score-counter", `Score is ${gameState.score.toLocaleString()}`);
    this.#updateTextContent("main-button-clicked-times", `Button clicks: ${gameState.stats.totalClicks.toLocaleString()}`);
    this.#updateTextContent("totalscore", `Total score: ${gameState.stats.totalScore.toLocaleString()}`);
  }
  clicksPerSeccondApplyDOM() {
    this.#updateTextContent("clicks-per-second", `Click(s) Per Second(CPS): ${gameState.clicksPerSecond}`);
  }
  floatCPSValue(event) {
    const msgid = `cps-float-value-${Date.now()}`;
    const x = event.clientX;
    const y = event.clientY;

    const foreground = document.getElementById("app");
    const div = document.createElement("div");
    div.className = "floating-cps";
    div.id = msgid;
    div.textContent = `+${gameState.cps}`;
    foreground.appendChild(div);

    const floatcpsElement = document.getElementById(msgid);
    floatcpsElement.style.position = 'absolute';
    floatcpsElement.style.pointerEvents = 'none';
    floatcpsElement.style.left = x - 10 + 'px';
    floatcpsElement.style.top = y - 10 + 'px';
    floatcpsElement.style.animation = 'floatWord 5s forwards linear';

    setTimeout(() => floatcpsElement.remove(), 5000); 
  }
}

export class MainButtonController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }
  #handleClick() {
    this.model.gameDataProcess();
    this.view.ApplyDOM();
    this.view.floatCPSValue(event);
  }

  init(element) {
    element.addEventListener('click', () => this.#handleClick());
    setInterval(() => {
      this.view.clicksPerSeccondApplyDOM();
      this.model.resetCPS();
    }, 1000);
  }
}

export class DataManagementModel {
  loadGame() {
    const savedData = localStorage.getItem('GameData');
    if (savedData) Object.assign(gameState, JSON.parse(savedData));
  }
  saveGame() {
    localStorage.setItem('GameData', JSON.stringify(gameState));
    createNotification("Saved.");
  }
  resetGame() {
    localStorage.removeItem('GameData');
    location.reload();
  }
  static autoSaveGame() {

  }
}

export class DataManagementView {
  errorText(error, gameDataProcessState) {
    console.error(`Failed to ${gameDataProcessState} game data:`, error);
    createNotification(`Failed to ${gameDataProcessState} game data.`);
  }
}

export class DataManagementController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.autoSaveInterval = null;
  }

  loadGame() {
    try {
      this.model.loadGame();
      (gameState.settings.autosave) ? document.getElementById("autosave-checkbox").checked = true : document.getElementById("autosave-checkbox").checked = false;
      updateDOM();
    } catch (error) {
      this.view.errorText(error, "load");
    }
  }

  saveGame(element) {
    try {
      element.addEventListener('click', () => this.model.saveGame());
    } catch (error) {
      this.view.errorText(error, "save");
    }
  }

  resetGame(element) {
    element.addEventListener('click', () => {
      if (confirm("Are you sure you want to reset?") && confirm("Do you truly, truly want to reset? This action cannot be undone.")) {
        this.model.resetGame();
      }
    });
  }

  autoSaveGame(element) {
    const autoSaveGameTrigger = () => {
      if (this.autoSaveInterval) clearInterval(this.autoSaveInterval);

      if (element.checked) {
        this.autoSaveInterval = setInterval(this.model.saveGame, 60000);
        gameState.settings.autosave = true;
      } else {
        clearInterval(this.autoSaveInterval);
        gameState.settings.autosave = false;
      }
    }
    element.addEventListener('change', autoSaveGameTrigger);
    window.addEventListener('load', autoSaveGameTrigger);
  }
}

(function playTimer() {
  setInterval(() => {
    gameState.stats.minutes += 1;
    if (gameState.stats.minutes % 60 == 0 && gameState.stats.minutes !== 0) {
      gameState.stats.hours += 1;
      gameState.stats.minutes = 0;
    }
    updateDOM();
  }, 60000)
}());

export function unlockContent(lockedElement, costElement, requiredScore) {
  window.addEventListener('load', () => {
    if (gameState.stats.totalScore >= requiredScore) {
      lockedElement.setAttribute("aria-disabled", "false");
      costElement.remove();
    }
  });
}

class Upgrade {
  constructor(id, name, cost, effectformula, effectdescription, description) {
    this.id = id;
    this.name = name;
    this.cost = cost;
    this.effectformula = effectformula;
    this.effectdescription = effectdescription;
    this.description = description;
  }
  applyDOM() {
    const upgradesArea = document.getElementById("upgrades-area");
  
    const upgrade = document.createElement("div");
    upgrade.className = "upgrade";
    upgrade.id = this.id;
  
    const tooltip = document.createElement("div");
    tooltip.className = "upgrade-tooltip";

    const upgradeName = document.createElement("div");
    upgradeName.className = "upgrade-name";
    upgradeName.textContent = this.name;

    const upgradeCost = document.createElement("div");
    upgradeCost.className = "upgrade-cost";
    upgradeCost.textContent = `${this.cost.toLocaleString()} score`;

    const upgradeEffect = document.createElement("div");
    upgradeEffect.className = "upgrade-effect";
    upgradeEffect.textContent = this.effectdescription;

    const upgradeDescription = document.createElement("div");
    upgradeDescription.className = "upgrade-description";
    upgradeDescription.textContent = this.description;

    tooltip.appendChild(upgradeName);
    tooltip.appendChild(upgradeCost);
    tooltip.appendChild(upgradeEffect);
    tooltip.appendChild(upgradeDescription);
    upgrade.appendChild(tooltip);
    upgradesArea.prepend(upgrade);
  }
  costRequirement() {
    return gameState.score >= this.cost;
  }
  paymentCost() {
    document.getElementById(this.id).addEventListener('click', () => {
      if (this.costRequirement()) {
        gameState.score -= this.cost;
        this.effectformula();
        updateDOM();
        document.getElementById(this.id).remove();
        gameState.boughtUpgrades.push(this.id);
      } else createNotification("You don't have enough score!");
    });
  }
}

export function upgradeLoad(id, name, cost, effectformula, effectdescription, description) {
  upgradesList.push(new Upgrade(id, name, cost, effectformula, effectdescription, description));
}

const upgradesList = [];

function renderUpgrades() {
  upgradesList.forEach(upgrade => {
    if (!gameState.boughtUpgrades.includes(upgrade.id)) {
      upgrade.applyDOM();
      upgrade.paymentCost();
    }
  });
}

upgradeLoad("cps+1", "CPS +1", 100, () => { gameState.cps += 1; }, "CPS +1", "CPS increases by 1.");
upgradeLoad("cps+2", "CPS +2", 500, () => { gameState.cps += 2; }, "CPS +2", "CPS increases by 2.");
upgradeLoad("cps+3", "CPS +3", 1000, () => { gameState.cps += 3; }, "CPS +3", "CPS increases by 3.");

function createNotification(msg) {
  const msgid = `notification-${Date.now()}`;
  const notificationArea = document.getElementById("notification-area");
  
  const div = document.createElement("div");
  div.className = "notification";
  div.id = msgid;
  
  div.textContent = msg; 
  
  const closeBtn = document.createElement("span");
  closeBtn.className = "close-notification";
  closeBtn.textContent = "x";
  div.prepend(closeBtn);
  
  notificationArea.prepend(div);

  const notificationTimeout = setTimeout(() => document.getElementById(msgid).remove(), 10000);

  const close_notification = document.querySelector(".close-notification");
  close_notification.addEventListener('click', () => {
    close_notification.parentNode.remove();
    clearTimeout(notificationTimeout);
  });
}

export function GameDataExport(element) {
  const GameDataExportTrigger = () => {
    const blob = new Blob([btoa(JSON.stringify(gameState))], { type: 'text/plain' });

    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'gamedata.txt';
    a.click();
  }
  element.addEventListener('click', GameDataExportTrigger);
  window.addEventListener("keydown", (event) => KeyboardShortcut(event, GameDataExportTrigger, "ctrlKey" && "e"));
}

export function GameDataImport(element) {
  const GameDataImportTrigger = (ev) => {
    const file = ev.target.files;
    const reader = new FileReader();
    reader.readAsText(file[0]);

    reader.onload = function() {
      Object.assign(gameState, JSON.parse(atob(reader.result)));
      updateDOM();
    }
  }
  element.addEventListener("change", GameDataImportTrigger);
  window.addEventListener("keydown", (event) => KeyboardShortcut(event, GameDataImportTrigger, "ctrlKey" && "i"));
}

export function createModal(element, container) {
  element.addEventListener('click', () => {
    const foreground = document.getElementById("app");

    const modal_background = document.createElement("div");
    modal_background.id = "modal-background";
  
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.id = `${element.id}-modal`;
  
    modal.innerHTML = container; 
  
    const closeBtn = document.createElement("span");
    closeBtn.id = `${element.id}-close-modal`;
    closeBtn.textContent = "x";
  
    foreground.prepend(modal_background);
    modal_background.prepend(modal);
    modal.prepend(closeBtn);

    if (element.id === "game-upgrades-button") renderUpgrades();

    const close_modal = document.getElementById(`${element.id}-close-modal`);
    close_modal.addEventListener('click', () => document.getElementById(`${element.id}-modal`).parentNode.remove());
  });
}