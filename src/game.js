const gameState = {
  score: 0,
  cps: 1,
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
    scoreCounter.innerHTML = `Score is ${gameState.score.toLocaleString()}`;
  } catch (error) {
    console.warn("DOM Update Error:", error.message);
  } 
  try {
    const MainButtonClickedTimes = document.getElementById("main-button-clicked-times");
    if (!MainButtonClickedTimes) throw new Error("main-button-clicked-times Element not found");
    MainButtonClickedTimes.innerHTML = `Button clicks: ${gameState.stats.totalClicks.toLocaleString()}`;
  } catch (error) {
    console.warn("DOM Update Error:", error.message);
  }
  try {
    const TotalScore = document.getElementById("totalscore");
    if (!TotalScore) throw new Error("totalscore Element not found");
    TotalScore.innerHTML = `Total score: ${gameState.stats.totalScore.toLocaleString()}`;
  } catch (error) {
    console.warn("DOM Update Error:", error.message);
  }
  try {
    const PlayTime = document.getElementById("playtime");
    if (!PlayTime) throw new Error("playtime Element not found");
    PlayTime.innerHTML = `Playtime: ${gameState.stats.hours} hours, ${gameState.stats.minutes} minutes`;
  } catch (error) {
    console.warn("DOM Update Error:", error.message);
  }
}

// Main button click processing
export function initializeMainButton(element) {
  element.addEventListener('click', (e) => {
    gameState.score += gameState.cps;
    gameState.stats.totalScore += gameState.cps;
    gameState.stats.totalClicks++;
    updateDOM();
    floatcpsvalue(e);
  });
}

function floatcpsvalue(e) {
  const msgid = `cps-float-value-${Date.now()}`;
  const x = e.clientX;
  const y = e.clientY;

  document.getElementById("app").insertAdjacentHTML("afterbegin", `
    <div class="floating-cps" id='${msgid}'>+${gameState.cps}</div>
  `);

  const floatcpsElement = document.getElementById(msgid);
  floatcpsElement.style.position = 'absolute';
  floatcpsElement.style.pointerEvents = 'none';
  floatcpsElement.style.left = x - 10 + 'px';
  floatcpsElement.style.top = y - 10 + 'px';
  floatcpsElement.style.animation = 'floatWord 5s forwards linear';

  setTimeout(() => floatcpsElement.remove(), 5000); 
}

// Data Management Functions (Save, Load, Data Deletion)
export function initializeDataManagement(saveButton, removeButton, autoSaveButton) {
  const loadGame = () => {
    try {
      const savedData = localStorage.getItem('GameData');
      if (savedData) Object.assign(gameState, JSON.parse(savedData));
    } catch (error) {
      console.error("Failed to load game data:", error);
      createNotification("Failed to load game data.");
    }
    (gameState.settings.autosave) ? document.getElementById("autosave-checkbox").checked = true : document.getElementById("autosave-checkbox").checked = false;
    updateDOM();
  }
  window.addEventListener('DOMContentLoaded', loadGame);

  const saveGame = () => {
    try {
      localStorage.setItem('GameData', JSON.stringify(gameState));
      createNotification("Saved.");
    } catch (error) {
      console.error("Failed to save game data:", error);
      createNotification("Failed to save game data.");
    }
  }
  saveButton.addEventListener('click', saveGame);

  const resetGame = () => {
    if (confirm("Are you sure you want to reset?")) {
      if (confirm("Do you truly, truly want to reset? This action cannot be undone.")) {
        localStorage.removeItem('GameData');
        location.reload();
      }
    }
  }
  removeButton.addEventListener('click', resetGame);

  let autoSaveInterval;
  const autoSaveGame = () => {
    if (autoSaveInterval) clearInterval(autoSaveInterval);

    if (autoSaveButton.checked) {
      autoSaveInterval = setInterval(saveGame, 60000);
      gameState.settings.autosave = true;
    } else {
      clearInterval(autoSaveInterval);
      gameState.settings.autosave = false;
    }
  }
  autoSaveButton.addEventListener('click', autoSaveGame);
  window.addEventListener('load', autoSaveGame);
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
    document.getElementById("upgrades-area").insertAdjacentHTML("afterbegin", `
      <div class="upgrade" id='${this.id}'>
        <div class="upgrade-tooltip">
          <div class="upgrade-name">${this.name}</div>
          <div class="upgrade-cost">${this.cost.toLocaleString()} score</div>
          <div class="upgrade-effect">${this.effectdescription}</div>
          <div class="upgrade-description">${this.description}</div>
        </div>
      </div>
    `);
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
  document.getElementById("notification-area").insertAdjacentHTML("afterbegin", `
    <div class="notification" id='${msgid}'>
      <span class="close-notification">x</span>${msg}
    </div>
  `);
  const notificationTimeout = setTimeout(() => document.getElementById(msgid).remove(), 10000);

  const close_notification = document.querySelector(".close-notification");
  close_notification.addEventListener('click', () => {
    close_notification.parentNode.remove();
    clearTimeout(notificationTimeout);
  });
}
  }
}

export function createModal(element, container) {
  element.addEventListener('click', () => {
    const foreground = document.getElementById("app");
    foreground.insertAdjacentHTML("afterbegin", `
      <div id="modal-background">
        <div class="modal" id='${element.id}-modal'>
          <span id="${element.id}-close-modal">x</span>${container}
        </div>
      </div>
    `);

    if (element.id === "game-upgrades-button") renderUpgrades();

    const close_modal = document.getElementById(`${element.id}-close-modal`);
    close_modal.addEventListener('click', () => document.getElementById(`${element.id}-modal`).parentNode.remove());
  });
}