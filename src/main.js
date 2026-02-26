import './style.css'
import { ButtonClick, GameReset, Save } from './game.js'

document.querySelector('#app').innerHTML = `
  <div>
    <div id="counter"></div>
    <button id="main-button" type="button"></button>
    <div id="buttons" class="right bottom">
      <label>AutoSave:<input id="autosave" type="checkbox" checked></label>
      <button id="save-button" type="button">Save</button>
      <button id="upgrade-button" type="button">Upgrades</button>
      <button id="status-button" type="button">Status</button>
    </div>
    <button id="reset-button" class="left bottom" type="button">Reset</button>
  </div>
`

ButtonClick(document.getElementById("main-button"));
GameReset(document.getElementById("reset-button"));
Save(document.getElementById("save-button"));
