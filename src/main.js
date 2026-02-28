import './style.css'
import { ButtonClick, GameReset, Save } from './game.js'

document.querySelector('#app').innerHTML = `
  <header>
    <div id="notification-area">
    </div>
    <div id="upgrades-section">
      <span class="section-title">Upgrades</span>
      <div id="upgrades">
      </div>
    </div>
  </header>
  <div>
    <div id="counter"></div>
    <button id="main-button" type="button"></button>
    <div id="buttons" class="right bottom">
      <div id="overall-main-button-clicked-times"></div>
      <label>AutoSave:<input id="autosave" type="checkbox" checked></label>
      <button id="save-button" type="button">Save</button>
      <button id="status-button" type="button">Status</button>
    </div>
    <button id="reset-button" class="left bottom" type="button">Reset</button>
  </div>
`

ButtonClick(document.getElementById("main-button"));
GameReset(document.getElementById("reset-button"));
Save(document.getElementById("save-button"));
