import './style.css'
import { ButtonClick, GameReset } from './game.js'

document.querySelector('#app').innerHTML = `
  <div>
    <div id="counter"></div>
    <button id="main-button" type="button"></button>
    <button id="reset-button" class="right bottom" type="button">Reset</button>
  </div>
`

ButtonClick(document.getElementById("main-button"));
GameReset(document.getElementById("reset-button"));
