let lifetime_score; //game-lifetime-score
let score = 0; //game-score
let cps = 1; //game-click-per-score
let overall_clicked_times = 0; //game-button-clicked-times
let lifetime_playtime; //game-lifetime-playtime
let playtime; //game-playtime

export function MainButtonClick(element) {
  const score_counter = document.getElementById("score-counter");
  const overall_main_button_clicked_times = document.getElementById("overall-main-button-clicked-times");
  const MainButtonClickTrigger = () => {
    score += cps;
    overall_clicked_times += 1;
    score_counter.innerHTML = `Count is ${score}`;
    overall_main_button_clicked_times.innerHTML = `Overall button click times: ${overall_clicked_times}`;
    //console.count("score");
    //console.log(isMultipleOfTen(score));
  }
  element.addEventListener('click', MainButtonClickTrigger);
}

window.onload = function() {
  const autosave_checkbox = document.getElementById("autosave-checkbox");
  const score_counter = document.getElementById("score-counter");
  const overall_main_button_clicked_times = document.getElementById("overall-main-button-clicked-times");
  const storage_score = parseInt(localStorage.getItem('score')) || 0;
  const storage_cps = parseInt(localStorage.getItem('cps')) || 1;
  const storage_overall_clicked_times = parseInt(localStorage.getItem('overall_clicked_times')) || 0;
  const storage_autosave = JSON.parse(localStorage.getItem('autosave'));
  score = storage_score;
  cps = storage_cps;
  overall_clicked_times = storage_overall_clicked_times;
  autosave_checkbox.checked = storage_autosave;
  score_counter.innerHTML = `Count is ${score}`;
  overall_main_button_clicked_times.innerHTML = `Overall button click times: ${overall_clicked_times}`;
}

export function GameDataRemove(element) {
  const GameDataRemoveTrigger = () => {
    const GameDataRemoveConfirm = confirm("本当にリセットしますか?");
    if (GameDataRemoveConfirm) {
      const SecondFactorGameDataRemoveConfirm = confirm("本当に本当にリセットしますか?");
      if (SecondFactorGameDataRemoveConfirm) {
        localStorage.removeItem('score');
        localStorage.removeItem('cps');
        localStorage.removeItem('overall_clicked_times');
        localStorage.removeItem('autosave');
        location.reload();
      }
    }
  }
  element.addEventListener('click', GameDataRemoveTrigger);
}

export function GameDataSave(element) {
  let AutoSaveInterval;
  const autosave_checkbox = document.getElementById("autosave-checkbox");
  const GameDataSaveTrigger = () => {
    localStorage.setItem('score', score);
    localStorage.setItem('cps', cps);
    localStorage.setItem('overall_clicked_times', overall_clicked_times);
    localStorage.setItem('autosave', autosave_checkbox.checked);
    CreateNotification("saved_dialog", "Saved.");
    //console.log("Saved.");
  }
  element.addEventListener('click', GameDataSaveTrigger);

  const AutoSaveTrigger = () => {
    if (autosave_checkbox.checked) {
      //console.log("autosave_on");
      AutoSaveInterval = setInterval(GameDataSaveTrigger, 60000);
    } else {
      //console.log("autosave_off");
      clearInterval(AutoSaveInterval);
    }
  }
  autosave_checkbox.addEventListener('click', AutoSaveTrigger);
  window.addEventListener('load', AutoSaveTrigger);
}

function CreateNotification(msgid, msg) {
  const notification_area = document.getElementById("notification-area");
  notification_area.insertAdjacentHTML("afterbegin", `<div class="notification" id='${msgid}'><span id="close-notification">x</span>${msg}</div>`);
  setTimeout(() => {
    const notification = document.getElementById(`${msgid}`);
    notification.remove();
  }, 10000); 
  
  const close_notification = document.getElementById("close-notification");
  const NotificationCloseTrigger = () => {
    close_notification.parentNode.remove();
  }
  close_notification.addEventListener('click', NotificationCloseTrigger);
}

//function isMultipleOfTen(number) {
//  if (number % 10 === 0) {
//    console.log("level_up");
//  }
//}
