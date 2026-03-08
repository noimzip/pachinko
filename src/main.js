import './style.css'
import { initializeMainButton, initializeDataManagement, GameDataExport, GameDataImport, unlockContent, createModal } from './game.js'

document.querySelector('#app').innerHTML = `
  <header>
    <div id="notification-area">
    </div>
  </header>
  <div>
    <div id="header-stats-section">
      <div id="score-counter"></div>
      <div id="clicks-per-second"></div>
    </div>
    <button id="main-button" type="button"></button>
    <div id="buttons" class="right bottom">
      <div id="main-button-clicked-times"></div>
      <div id="totalscore"></div>
      <div id="playtime"></div>
      <label>AutoSave:<input id="autosave-checkbox" type="checkbox" checked></label>
      <button id="game-data-save-button" class="basic-button" type="button">Save<div class="explain-sentence">(CTRL + S)</div></button>
      <button id="game-status-button" class="basic-button" type="button">Status</button>
      <button id="game-upgrades-button" class="basic-button" type="button" aria-disabled="true">Upgrades<div class="explain-sentence" id="upgrade-cost">(Unlock: 100)</div></button>
      <button id="export-button" class="basic-button" type="button">Export<div class="explain-sentence">(CTRL + E)</div></button>
      <label for="import-button" class="basic-button">
        Import<div class="explain-sentence">(CTRL + I)</div>
      </label>
      <input type="file" id="import-button" style="display:none">
    </div>
    <button id="game-data-remove-button" class="basic-button left bottom" type="button">Reset</button>
  </div>
`

initializeMainButton(document.getElementById("main-button"));
initializeDataManagement(document.getElementById("game-data-save-button"), document.getElementById("game-data-remove-button"), document.getElementById("autosave-checkbox"));
GameDataExport(document.getElementById("export-button"));
GameDataImport(document.getElementById("import-button"));
unlockContent(document.getElementById("game-upgrades-button"), document.getElementById("upgrade-cost"), 100);
createModal(document.getElementById("game-upgrades-button"), `
    <div id="upgrades-section">
      <span class="section-title">Upgrades</span>
      <div id="upgrades-area">
      </div>
    </div>
  `);