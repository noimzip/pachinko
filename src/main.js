import './style.css'
import { ButtonClick, GameReset } from './game.js'

document.querySelector('#app').innerHTML = `
  <div>
    <div id="counter"></div>
    <button id="main-button" type="button"></button>
  </div>
`

ButtonClick(document.getElementById("main-button"));
