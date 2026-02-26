let lifetime_score; //game-lifetime-score
let score = 0; //game-score
let clicked_times;
let lifetime_playtime; //game-lifetime-playtime
let playtime; //game-playtime

export function ButtonClick(element) {
  const counter = document.getElementById("counter");
  const Count = () => {
    score += 1;
    counter.innerHTML = `Count is ${score}`;
    //console.count("score");
    //console.log(isMultipleOfTen(score));
  }
  element.addEventListener('click', Count);
}

window.onload = function() {
  const storage_score = parseInt(localStorage.getItem('score')) || 0;
  const storage_autosave = JSON.parse(localStorage.getItem('autosave'));
  score = storage_score;
  autosave.checked = storage_autosave;
  counter.innerHTML = `Count is ${score}`;
}

export function GameReset(element) {
  const ConfirmReset = () => {
    const ConfirmReset = confirm("本当にリセットしますか?");
    if (ConfirmReset) {
      const SecondFactorConfirmReset = confirm("本当に本当にリセットしますか?");
      if (SecondFactorConfirmReset) {
        localStorage.removeItem('score');
        localStorage.removeItem('autosave');
        location.reload();
      }
    }
  }
  element.addEventListener('click', ConfirmReset);
}

//export function ShowGameStatus(element) {
//}

export function Save(element) {
  const TriggerSave = () => {
    localStorage.setItem('score', score);
    localStorage.setItem('autosave', autosave.checked);
    console.log("Saved.");
  }
  element.addEventListener('click', TriggerSave);

  const autosave = document.getElementById("autosave");
  let TriggerAutoSave;
  const AutoSaveConditionCheck = () => {
    if (autosave.checked) {
      console.log("autosave_on");
      TriggerAutoSave = setInterval(TriggerSave, 10000);
    } else {
      console.log("autosave_off");
      clearInterval(TriggerAutoSave);
    }
  }
  autosave.addEventListener('click', AutoSaveConditionCheck);
  window.addEventListener('load', AutoSaveConditionCheck);
}

function isMultipleOfTen(number) {
  if (number % 10 === 0) {
    console.log("level_up")
  }
}

function level_up_check() {
}
