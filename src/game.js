const gameState = {
  score: 0,
  cps: 1,
  stats: {
    minutes: 0,
    hours: 0,
    totalClicks: 0,
    totalScore: 0
  },
  settings: {
    autosave: false
  },
  boughtUpgrades: [

  ]
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
    gameState.stats.totalClicks += 1;
    updateDOM();
    floatcpsvalue(e);
  });
}

function floatcpsvalue(e) {
  const msgid = `cps-float-value-${Date.now()}`;
  const x = e.clientX;
  const y = e.clientY;

  document.getElementById("app").insertAdjacentHTML
  (
    "afterbegin", 
    `<div class="floating-cps" id='${msgid}'>+${gameState.cps}</div>`
  );

  const floatcpsElement = document.getElementById(msgid);
  floatcpsElement.style.position = 'absolute';
  floatcpsElement.style.pointerEvents = 'none';
  floatcpsElement.style.left = x - 10 + 'px';
  floatcpsElement.style.top = y - 10 + 'px';
  floatcpsElement.style.animation = 'floatWord 5s forwards linear';

  setTimeout(() => {
    floatcpsElement.remove();
  }, 5000); 
}

// Data Management Functions (Save, Load, Data Deletion)
export function initializeDataManagement(saveButton, removeButton, autoSaveButton) {
  const loadGame = () => {
    try {
      const savedData = localStorage.getItem('GameData');
      if (savedData) {
        Object.assign(gameState, JSON.parse(savedData));
      }
    } catch (error) {
      console.error("Failed to load game data:", error);
      createNotification("Failed to load game data.");
    }
    if (gameState.settings.autosave) {
      document.getElementById("autosave-checkbox").checked = true;
    } else {
      document.getElementById("autosave-checkbox").checked = false;
    }
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
  const unlockContentCheck = () => {
    if (gameState.stats.totalScore >= requiredScore) {
      lockedElement.setAttribute("aria-disabled", "false");
      costElement.remove();
    }
  }
  window.addEventListener('load', unlockContentCheck);
}

class Upgrade {
  constructor(id, name, cost, effect, description) {
    this.id = id;
    this.name = name;
    this.cost = cost;
    this.effect = effect;
    this.description = description;
  }
  ApplyDOM() {
    document.getElementById("upgrades-area").insertAdjacentHTML
    (
      "afterbegin",
      `<div class="upgrade" id='${this.id}'>
        <div class="upgrade-tooltip">
          <div class="upgrade-name">${this.name}</div>
          <div class="upgrade-cost">${this.cost} score</div>
          <div class="upgrade-effect">+ ${this.effect} cps</div>
          <div class="upgrade-description">${this.description}</div>
        </div>
      </div>`
    );
  }
  PaymentCost() {
    const paymentCostTarget = document.getElementById(this.id);
    const PaymentCostTrigger = () => {
      if (gameState.score >= this.cost) {
        gameState.score -= this.cost;
        this.effect();
        updateDOM();
        paymentCostTarget.remove();
        gameState.boughtUpgrades.push(this.id); 
      } else {
        createNotification("Lack of Score!");        
      }
    }
    paymentCostTarget.addEventListener('click', PaymentCostTrigger);
  }
}

function upgradeLoad(id, name, cost, effect, description) {
  window.addEventListener('load', () => {
    if (!gameState.boughtUpgrades.includes(id)) {
      const loadedUpgrade = new Upgrade(id, name, cost, effect, description);
      loadedUpgrade.ApplyDOM();
      loadedUpgrade.PaymentCost();
    }
  });
}

upgradeLoad("cps+1", "CPS +1", 100, () => { gameState.cps += 1; }, "CPS increases by 1.");
upgradeLoad("cps+2", "CPS +2", 500, () => { gameState.cps += 2; }, "CPS increases by 2.");
upgradeLoad("cps+3", "CPS +3", 1000, () => { gameState.cps += 3; }, "CPS increases by 3.");

function createNotification(msg) {
  const msgid = `notification-${Date.now()}`;
  document.getElementById("notification-area").insertAdjacentHTML
  (
    "afterbegin", 
    `<div class="notification" id='${msgid}'>
      <span class="close-notification">x</span>${msg}
    </div>`
  );
  const notificationTimeout = setTimeout(() => {
    const notification = document.getElementById(msgid);
    notification.remove();
  }, 10000); 
  
  const close_notification = document.querySelector(".close-notification");
  close_notification.addEventListener('click', () => {
    close_notification.parentNode.remove();
    clearTimeout(notificationTimeout);
  });
}
  }
}

