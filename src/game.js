let lifetime_score; //game-lifetime-score
let score = 0; //game-score
let cps = 1; //game-click-per-score
let overall_clicked_times = 0; //game-button-clicked-times
let lifetime_playtime; //game-lifetime-playtime
let playtime; //game-playtime

export function ButtonClick(element) {
  const counter = document.getElementById("counter");
  const overall_main_button_clicked_times = document.getElementById("overall-main-button-clicked-times");
  const Count = () => {
    score += cps;
    overall_clicked_times += 1;
    counter.innerHTML = `Count is ${score}`;
    overall_main_button_clicked_times.innerHTML = `Overall button click times: ${overall_clicked_times}`;
    //console.count("score");
    //console.log(isMultipleOfTen(score));
  }
  element.addEventListener('click', Count);
}

window.onload = function() {
  const overall_main_button_clicked_times = document.getElementById("overall-main-button-clicked-times");
  const storage_score = parseInt(localStorage.getItem('score')) || 0;
  const storage_cps = parseInt(localStorage.getItem('cps')) || 1;
  const storage_overall_clicked_times = parseInt(localStorage.getItem('overall_clicked_times')) || 0;
  const storage_autosave = JSON.parse(localStorage.getItem('autosave'));
  score = storage_score;
  cps = storage_cps;
  overall_clicked_times = storage_overall_clicked_times;
  autosave.checked = storage_autosave;
  counter.innerHTML = `Count is ${score}`;
  overall_main_button_clicked_times.innerHTML = `Overall button click times: ${overall_clicked_times}`;
}

export function GameReset(element) {
  const ConfirmReset = () => {
    const ConfirmReset = confirm("本当にリセットしますか?");
    if (ConfirmReset) {
      const SecondFactorConfirmReset = confirm("本当に本当にリセットしますか?");
      if (SecondFactorConfirmReset) {
        localStorage.removeItem('score');
        localStorage.removeItem('cps');
        localStorage.removeItem('overall_clicked_times');
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
  const saved_dialog = document.getElementById("saved-dialog");
  const TriggerSave = () => {
    localStorage.setItem('score', score);
    localStorage.setItem('cps', cps);
    localStorage.setItem('overall_clicked_times', overall_clicked_times);
    localStorage.setItem('autosave', autosave.checked);
    saved_dialog.style.display = "block";
    //console.log("Saved.");
  }
  element.addEventListener('click', TriggerSave);

  const HideSavedDialog = () => {
    saved_dialog.style.display = "none";
  }

  const autosave = document.getElementById("autosave");
  let TriggerAutoSave;
  const AutoSaveConditionCheck = () => {
    if (autosave.checked) {
      //console.log("autosave_on");
      TriggerAutoSave = setInterval(TriggerSave, 60000);
    } else {
      //console.log("autosave_off");
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
