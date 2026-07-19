const gameState = {
  score: 0,
  cps: 1,
  clicksPerSecond: 0,
  stats: { minutes: 0, hours: 0, totalClicks: 0, totalScore: 0 },
  settings: { autosave: false },
  boughtUpgrades: [],
  unlockedAchievements: [],
};

/*
class UpdateDOMModel {
  #errorcheck(element) {
    try {
      if (!element) throw new Error(`${element} Element not found`);
    } catch (error) {
      console.warn("DOM Update Error:", error.message);
    }
  }
}

class UpdateDOMView {
  
}

class UpdateDOMController {
  
}*/

// DOM management functions
function updateDOM() {
  try {
    const scoreCounter = document.getElementById("score-counter-display");
    if (!scoreCounter) throw new Error("score-counter-display Element not found");
    scoreCounter.textContent = `Score is ${gameState.score.toLocaleString()}`;
  } catch (error) {
    console.warn("DOM Update Error:", error.message);
  }
}

function keyboardShortcut(event, func, condition) {
  if (condition) {
    event.preventDefault();
    func();
  }
}

export class MainButtonModel {
  gameDataProcess() {
    gameState.score += gameState.cps;
    gameState.stats.totalScore += gameState.cps;
    gameState.stats.totalClicks++;
    gameState.clicksPerSecond++;
  }
  resetCPS() {
    gameState.clicksPerSecond = 0;
  }
  playSound() {
    const sound = new Audio("/mainbutton.mp3");
    sound.play();
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
  applyDOM() {
    this.#updateTextContent(
      "score-counter-display",
      `Score is ${gameState.score.toLocaleString()}`,
    );
  }
  clicksPerSeccondApplyDOM() {
    this.#updateTextContent(
      "clicks-per-second-display",
      `Click(s) Per Second(CPS): ${gameState.clicksPerSecond}`,
    );
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
    floatcpsElement.style.position = "absolute";
    floatcpsElement.style.pointerEvents = "none";
    floatcpsElement.style.left = x - 10 + "px";
    floatcpsElement.style.top = y - 10 + "px";
    floatcpsElement.style.animation = "floatWord 5s forwards linear";

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
    this.view.applyDOM();
    this.view.floatCPSValue(event);
    this.model.playSound();
  }

  init(element) {
    element.addEventListener("click", () => this.#handleClick());
    setInterval(() => {
      this.view.clicksPerSeccondApplyDOM();
      this.model.resetCPS();
    }, 1000);
  }
}

export class DataManagementModel {
  loadGame() {
    const savedData = localStorage.getItem("GameData");
    if (savedData) Object.assign(gameState, JSON.parse(savedData));
  }
  saveGame() {
    localStorage.setItem("GameData", JSON.stringify(gameState));
    createNotification("Saved.");
  }
  resetGame() {
    localStorage.removeItem("GameData");
  }
}

export class DataManagementView {
  errorText(error, gameDataProcessState) {
    console.error(`Failed to ${gameDataProcessState} game data:`, error);
    createNotification(`Failed to ${gameDataProcessState} game data.`);
  }
}

export class DataManagementController {
  constructor(model, view, autosaveTriggerCheckboxElement) {
    this.model = model;
    this.view = view;
    this.autosaveTriggerCheckboxElement = autosaveTriggerCheckboxElement;
    this.autoSaveInterval = null;
  }

  loadGame() {
    try {
      this.model.loadGame();
      gameState.settings.autosave
        ? (document.getElementById(this.autosaveTriggerCheckboxElement).checked = true)
        : (document.getElementById(this.autosaveTriggerCheckboxElement).checked = false);
      updateDOM();
    } catch (error) {
      this.view.errorText(error, "load");
    }
  }

  saveGame(element) {
    try {
      element.addEventListener("click", this.model.saveGame);
      window.addEventListener("keydown", (event) =>
        keyboardShortcut(event, this.model.saveGame, event.ctrlKey && event.key === "s"),
      );
    } catch (error) {
      this.view.errorText(error, "save");
    }
  }

  resetGame(element) {
    element.addEventListener("click", () => {
      if (
        confirm("Are you sure you want to reset?") &&
        confirm("Do you truly, truly want to reset? This action cannot be undone.")
      ) {
        this.model.resetGame();
        location.reload();
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
    };
    element.addEventListener("change", autoSaveGameTrigger);
    window.addEventListener("load", autoSaveGameTrigger);
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
  }, 60000);
})();

export function unlockContent(lockedElement, requiredScore) {
  window.addEventListener("load", () => {
    if (gameState.stats.totalScore >= requiredScore) {
      lockedElement.setAttribute("aria-disabled", "false");

      let lockedElementText = "";
      lockedElement.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          lockedElementText += node.textContent;
        }
      });

      lockedElement.replaceChildren();
      lockedElement.textContent = lockedElementText.trim();
    }
  });
}

class UpgradeModel {
  costRequirement(cost) {
    return gameState.score >= cost;
  }
}

class UpgradeView {
  applyDOM(id, name, cost, effectdescription, description) {
    const upgradesArea = document.getElementById("upgrades-area");

    const upgrade = document.createElement("div");
    upgrade.className = "upgrade";
    upgrade.id = id;

    const tooltip = document.createElement("div");
    tooltip.className = "upgrade-tooltip";

    const upgradeName = document.createElement("div");
    upgradeName.className = "upgrade-name";
    upgradeName.textContent = name;

    const upgradeCost = document.createElement("div");
    upgradeCost.className = "upgrade-cost";
    upgradeCost.textContent = `${cost.toLocaleString()} score`;

    const upgradeEffect = document.createElement("div");
    upgradeEffect.className = "upgrade-effect";
    upgradeEffect.textContent = effectdescription;

    const upgradeDescription = document.createElement("div");
    upgradeDescription.className = "upgrade-description";
    upgradeDescription.textContent = description;

    tooltip.appendChild(upgradeName);
    tooltip.appendChild(upgradeCost);
    tooltip.appendChild(upgradeEffect);
    tooltip.appendChild(upgradeDescription);
    upgrade.appendChild(tooltip);
    upgradesArea.prepend(upgrade);
  }
  renderUpgrades() {
    const upgradesList = [
      [
        "cps+1",
        "The Beginning",
        100,
        () => {
          gameState.cps += 1;
        },
        "CPS +1",
        "CPS increases by 1.",
      ],
      [
        "cps+2",
        "kill two birds with one stone",
        500,
        () => {
          gameState.cps += 2;
        },
        "CPS +2",
        "CPS increases by 2.",
      ],
      [
        "cps+3",
        "CPS +3",
        1000,
        () => {
          gameState.cps += 3;
        },
        "CPS +3",
        "CPS increases by 3.",
      ],
      [
        "heroic-tale",
        "",
        10000,
        () => {},
        "An Endless Heroic Tale",
        "For every 10,000 points, choose one upgrade from three options to receive.",
      ],
    ];
    upgradesList.forEach((upgrade) => {
      if (!gameState.boughtUpgrades.includes(upgrade[0])) {
        new UpgradeView().applyDOM(upgrade);
        new UpgradeController(upgrade).paymentCost();
      }
    });
  }
}

class UpgradeController {
  constructor(model, view, id, name, cost, effectformula, effectdescription, description) {
    this.model = model;
    this.view = view;
    this.id = id;
    this.name = name;
    this.cost = cost;
    this.effectformula = effectformula;
    this.effectdescription = effectdescription;
    this.description = description;
  }
  paymentCost() {
    document.getElementById(this.id).addEventListener("click", () => {
      if (this.model.costRequirement()) {
        gameState.score -= this.cost;
        this.effectformula();
        updateDOM();
        document.getElementById(this.id).remove();
        gameState.boughtUpgrades.push(this.id);
      } else createNotification("You don't have enough score!");
    });
  }
}

class endlessHeroicTale {
  constructor(effect, timeLeft) {}
  effect() {
    if (gameState.score % 10000 && gameState.boughtUpgrades.includes("heroic-tale")) {
      setTimeout(() => {
        effect();
      }, timeLeft);
      // cps 2x 2min
      // autoclick 2min(cps: 13)
      // timemachine 2min skip(cps: 10, score only)
      // re:endlessheroictale 2min endlessheroictale score 5000
      // choice select two more but, reroll can't use
      // permanently cps +1
      // overtime next card time 2x
    }
  }
}

//upgradeLoad("cps+1", "CPS +1", 100, () => { gameState.cps += 1; }, "CPS +1", "CPS increases by 1.");

class Achievement {
  constructor(id, name, requirement, description) {
    this.id = id;
    this.name = name;
    this.requirement = requirement;
    this.description = description;
  }
  applyDOM() {
    if (gameState.score >= this.requirement) {
      const achievementsArea = document.getElementById("achievements-area");

      const achievement = document.createElement("div");
      achievement.className = "achievement";
      achievement.id = this.id;

      const tooltip = document.createElement("div");
      tooltip.className = "achievement-tooltip";

      const achievementName = document.createElement("div");
      achievementName.className = "achievement-name";
      achievementName.textContent = this.name;

      const achievementRequirement = document.createElement("div");
      achievementRequirement.className = "achievement-requirement";
      achievementRequirement.textContent = this.requirement;

      const achievementDescription = document.createElement("div");
      achievementDescription.className = "achievement-description";
      achievementDescription.textContent = this.description;

      tooltip.appendChild(achievementName);
      tooltip.appendChild(achievementRequirement);
      tooltip.appendChild(achievementDescription);
      achievement.appendChild(tooltip);
      achievementsArea.prepend(achievement);
    }
  }
  scoreRequirement() {
    return gameState.score >= this.requirement;
  }
  unlockAchievement() {
    if (this.scoreRequirement()) createNotification(`Achievement Unlocked: ${this.name}`);
  }
}

export class AutomationModel {
  requirementScoreRisingCalculation() {
    x ^ (2 + requirement);
  }
}

export class AutomationView {
  applyDOM() {
    const automation = document.createElement("div");
    automation.className = "automation";
    automation.id = this.id;

    const tooltip = document.createElement("div");
    tooltip.className = "automation-tooltip";

    const automationName = document.createElement("div");
    automationName.className = "automation-name";
    automationName.textContent = this.name;

    const automationRequirement = document.createElement("div");
    automationRequirement.className = "automation-requirement";
    automationRequirement.textContent = this.requirement;

    const automationDescription = document.createElement("div");
    automationDescription.className = "automation-description";
    automationDescription.textContent = this.description;

    tooltip.appendChild(automationName);
    tooltip.appendChild(automationRequirement);
    tooltip.appendChild(automationDescription);
    automation.appendChild(tooltip);
    automationsArea.prepend(automation);
  }
}

export class AutomationController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  //if (gameState.score >= this.requirement) {
  //  this.view.applyDOM();
  //}
}

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
  close_notification.addEventListener("click", () => {
    close_notification.parentNode.remove();
    clearTimeout(notificationTimeout);
  });
}

export function gameDataExport(element) {
  const gameDataExportTrigger = () => {
    const blob = new Blob([btoa(JSON.stringify(gameState))], { type: "text/plain" });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "gamedata.txt";
    a.click();
  };
  element.addEventListener("click", gameDataExportTrigger);
  window.addEventListener("keydown", (event) =>
    keyboardShortcut(event, gameDataExportTrigger, event.ctrlKey && event.key === "e"),
  );
}

export function gameDataImport(element) {
  const gameDataImportTrigger = (ev) => {
    if (event.type === "keydown") {
      element.click();
      return;
    }
    const file = ev.target.files;
    const reader = new FileReader();
    reader.readAsText(file[0]);

    reader.onload = function () {
      Object.assign(gameState, JSON.parse(atob(reader.result)));
      updateDOM();
    };
  };
  element.addEventListener("change", gameDataImportTrigger);
  window.addEventListener("keydown", (event) =>
    keyboardShortcut(event, gameDataImportTrigger, event.ctrlKey && event.key === "i"),
  );
}

export function createModal(element, container) {
  element.addEventListener("click", () => {
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

    if (element.id === "upgrade-modal-trigger-button") new UpgradeView().renderUpgrades();

    if (element.id === "status-modal-trigger-button") {
      try {
        const mainButtonClickedTimes = document.getElementById("main-button-clicked-times");
        if (!mainButtonClickedTimes) throw new Error("main-button-clicked-times Element not found");
        mainButtonClickedTimes.textContent = `Button clicks: ${gameState.stats.totalClicks.toLocaleString()}`;
      } catch (error) {
        console.warn("DOM Update Error:", error.message);
      }
      try {
        const totalScore = document.getElementById("totalscore");
        if (!totalScore) throw new Error("totalscore Element not found");
        totalScore.textContent = `Total score: ${gameState.stats.totalScore.toLocaleString()}`;
      } catch (error) {
        console.warn("DOM Update Error:", error.message);
      }
      try {
        const playTime = document.getElementById("playtime");
        if (!playTime) throw new Error("playtime Element not found");
        playTime.textContent = `Playtime: ${gameState.stats.hours} hours, ${gameState.stats.minutes} minutes`;
      } catch (error) {
        console.warn("DOM Update Error:", error.message);
      }
    }

    const close_modal = document.getElementById(`${element.id}-close-modal`);
    closeModalFunc(modal_background);
    closeModalFunc(close_modal);

    function closeModalFunc(close_action) {
      close_action.addEventListener("click", () =>
        document.getElementById(`${element.id}-modal`).parentNode.remove(),
      );
    }
  });
}
