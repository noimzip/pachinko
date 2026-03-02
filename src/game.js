const gameState = {
  score: 0,
  cps: 1,
  stats: {
    minutes: 0,
    hours: 0,
    totalClicks: 0
  },
  settings: {
    autosave: false
  },
  boughtUpgrades: [

  ]
};

// DOM management functions
function updateDOM() {
  document.getElementById("score-counter").innerHTML = `Count is ${gameState.score}`;
  document.getElementById("overall-main-button-clicked-times").innerHTML = `Overall button click times: ${gameState.stats.totalClicks}`;
  document.getElementById("overall-play-time").innerHTML = `Overall Playtime: ${gameState.stats.hours} hours, ${gameState.stats.minutes} minutes`;
}

// Main button click processing
export function initializeMainButton(element) {
  element.addEventListener('click', () => {
    gameState.score += gameState.cps;
    gameState.stats.totalClicks += 1;
    updateDOM();
  });
}

// Data Management Functions (Save, Load, Data Deletion)
export function initializeDataManagement(saveButton, removeButton, autoSaveButton) {
  const loadGame = () => {
    const savedData = localStorage.getItem('GameData');
    if (savedData) {
      Object.assign(gameState, JSON.parse(savedData));
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
    localStorage.setItem('GameData', JSON.stringify(gameState));
    createNotification("Saved.");
  }
  saveButton.addEventListener('click', saveGame);

  const resetGame = () => {
    const GameDataRemoveConfirm = confirm("本当にリセットしますか?");
    if (GameDataRemoveConfirm) {
      const SecondFactorGameDataRemoveConfirm = confirm("本当に本当にリセットしますか?");
      if (SecondFactorGameDataRemoveConfirm) {
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
      if (gameState.score >= this.cost && !gameState.boughtUpgrades.includes(this.id)) {
        gameState.score -= this.cost;
        gameState.cps += this.effect;
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

upgradeLoad("cps+1", "CPS +1", 100, 1, "CPS increases by 1.");
upgradeLoad("cps+2", "CPS +2", 500, 2, "CPS increases by 2.");
upgradeLoad("cps+3", "CPS +3", 1000, 3, "CPS increases by 3.");

// todo: Fix for reusing notification IDs
function createNotification(msg) {
  const notification_area = document.getElementById("notification-area");
  const msgid = `notification-${Date.now()}`;
  notification_area.insertAdjacentHTML
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
  }
}

//function isMultipleOfTen(number) {
//  if (number % 10 === 0) {
//    console.log("level_up");
//  }
//}
