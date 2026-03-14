import './style.css'
import { gameDataExport, gameDataImport, unlockContent, createModal, MainButtonModel, MainButtonView, MainButtonController, DataManagementModel, DataManagementView, DataManagementController } from './game.js'

document.querySelector('#app').innerHTML = `
  <div id="notification-area"></div>
  <div id="header-stats-section">
    <div id="score-counter"></div>
    <div id="clicks-per-second"></div>
  </div>
  <button id="main-button" type="button"></button>
  <div id="buttons" class="right bottom">
    <label>AutoSave:<input id="autosave-checkbox" type="checkbox" checked></label>
    <button id="game-data-save-button" type="button">Save<div class="explain-sentence">(CTRL + S)</div></button>
    <button id="game-status-button" type="button">Status</button>
    <button id="game-upgrades-button" type="button" aria-disabled="true">Upgrades<div class="explain-sentence" id="upgrade-cost">(Unlock: 100)</div></button>
    <button id="export-button" type="button">Export<div class="explain-sentence">(CTRL + E)</div></button>
    <label for="import-button">Import<div class="explain-sentence">(CTRL + I)</div></label>
    <input type="file" id="import-button" style="display:none">
  </div>
  <button id="game-data-remove-button" class="left bottom" type="button">Reset</button>
`
const dataManagementController = new DataManagementController(new DataManagementModel(), new DataManagementView());
window.addEventListener('DOMContentLoaded', dataManagementController.loadGame());
dataManagementController.saveGame(document.getElementById("game-data-save-button"));
dataManagementController.resetGame(document.getElementById("game-data-remove-button"));
dataManagementController.autoSaveGame(document.getElementById("autosave-checkbox"));

const mainButtonController = new MainButtonController(new MainButtonModel(), new MainButtonView());
mainButtonController.init(document.getElementById("main-button"));

gameDataExport(document.getElementById("export-button"));
gameDataImport(document.getElementById("import-button"));
unlockContent(document.getElementById("game-upgrades-button"), document.getElementById("upgrade-cost"), 100);
createModal(document.getElementById("game-status-button"), `
    <div id="status-section">
      <span class="section-title">Status</span>
      <div id="status-area">
        <div id="main-button-clicked-times"></div>
        <div id="totalscore"></div>
        <div id="playtime"></div>
      </div>
    </div>
  `);
createModal(document.getElementById("game-upgrades-button"), `
    <div id="upgrades-section">
      <span class="section-title">Upgrades</span>
      <div id="upgrades-area">
      </div>
    </div>
  `);