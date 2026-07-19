import "./style.css";
import {
  gameDataExport,
  gameDataImport,
  unlockContent,
  createModal,
  MainButtonModel,
  MainButtonView,
  MainButtonController,
  DataManagementModel,
  DataManagementView,
  DataManagementController,
} from "./game.js";

document.querySelector("#app").innerHTML = `
  <div id="notification-area"></div>
  <div id="header-stats-section">
    <div id="score-counter-display"></div>
    <div id="clicks-per-second-display"></div>
  </div>
  <button id="main-button" type="button"></button>
  <div id="buttons" class="right bottom">
    <label>AutoSave:<input id="autosave-trigger-checkbox" type="checkbox" checked></label>
    <button id="game-data-save-button" type="button">Save<div class="explain-sentence">(CTRL + S)</div></button>
    <button id="status-modal-trigger-button" type="button">Status</button>
    <button id="bigbang-modal-trigger-button" type="button">Bigbang</button>
    <button id="upgrade-modal-trigger-button" type="button" aria-disabled="true">Upgrades<div class="explain-sentence" id="upgrade-unlock-cost">(Unlock: 100)</div></button>
    <button id="automation-modal-trigger-button" type="button" aria-disabled="true">Automation<div class="explain-sentence" id="automation-unlock-cost">(Unlock: 1000)</div></button>
    <button id="game-data-export-trigger-button" type="button">Export<div class="explain-sentence">(CTRL + E)</div></button>
    <label for="game-data-import-trigger-button">Import<div class="explain-sentence">(CTRL + I)</div><input type="file" id="game-data-import-trigger-button" style="display:none"></label>
  </div>
  <button id="game-data-reset-button" class="left bottom" type="button">Reset</button>
  <div id="skills">
    <button>Passive</button>
    <button>Ability</button>
    <button>Ultimate</button>
  </div>
`;
const dataManagementController = new DataManagementController(
  new DataManagementModel(),
  new DataManagementView(),
  "autosave-trigger-checkbox",
);
window.addEventListener("DOMContentLoaded", dataManagementController.loadGame());
dataManagementController.saveGame(document.getElementById("game-data-save-button"));
dataManagementController.resetGame(document.getElementById("game-data-reset-button"));
dataManagementController.autoSaveGame(document.getElementById("autosave-trigger-checkbox"));

const mainButtonController = new MainButtonController(new MainButtonModel(), new MainButtonView());
mainButtonController.init(document.getElementById("main-button"));

gameDataExport(document.getElementById("game-data-export-trigger-button"));
gameDataImport(document.getElementById("game-data-import-trigger-button"));
unlockContent(document.getElementById("upgrade-modal-trigger-button"), 100);
unlockContent(document.getElementById("automation-modal-trigger-button"), 1000);
createModal(
  document.getElementById("status-modal-trigger-button"),
  `
    <div id="status-section">
      <span class="section-title">Status</span>
      <div id="status-area">
        <div id="main-button-clicked-times"></div>
        <div id="totalscore"></div>
        <div id="playtime"></div>
      </div>
    </div>
  `,
);
createModal(
  document.getElementById("upgrade-modal-trigger-button"),
  `
    <div id="upgrades-section">
      <span class="section-title">Upgrades</span>
      <div id="upgrades-area">
      </div>
    </div>
  `,
);
createModal(
  document.getElementById("automation-modal-trigger-button"),
  `
    <div id="automation-section">
      <span class="section-title">Automation</span>
      <div id="automation-area">
      </div>
    </div>
  `,
);
