import './style.css'
import { initializeMainButton, initializeDataManagement } from './game.js'

document.querySelector('#app').innerHTML = `
  <header>
    <div id="notification-area">
    </div>
    <div id="upgrades-section">
      <span class="section-title">Upgrades</span>
      <div id="upgrades-area">
      </div>
    </div>
  </header>
  <div>
    <div id="score-counter"></div>
    <button id="main-button" type="button"></button>
    <div id="buttons" class="right bottom">
      <div id="overall-main-button-clicked-times"></div>
      <div id="overall-play-time"></div>
      <label>AutoSave:<input id="autosave-checkbox" type="checkbox" checked></label>
      <button id="game-data-save-button" class="basic-button" type="button">Save</button>
      <button id="game-status-button" class="basic-button" type="button">Status</button>
      <button id="export-button" class="basic-button" type="button">Export</button>
      <button id="import-button" class="basic-button" type="button">Import</button>
    </div>
    <button id="game-data-remove-button" class="basic-button left bottom" type="button">Reset</button>
  </div>
`

initializeMainButton(document.getElementById("main-button"));
initializeDataManagement(document.getElementById("game-data-save-button"), document.getElementById("game-data-remove-button"), document.getElementById("autosave-checkbox"));