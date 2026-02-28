let lifetime_score; //game-lifetime-score
let score = 0; //game-score
let cps = 1; //game-click-per-score
let overall_clicked_times = 0; //game-button-clicked-times
let overall_play_minutes = 0; //game-overall-playtime
let overall_play_hours = 0; //game-overall-playtime
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
  const overall_playtime_dom = document.getElementById("overall-play-time");
    const GameDataArray = 
      [
        score,
        cps,
        autosave_checkbox.checked,
        overall_play_minutes,
        overall_play_hours,
        overall_clicked_times
      ];
    for (let i = 0; i < GameDataArray.length; i++) {
      const GameDataArrayStorage = JSON.parse(localStorage.getItem('GameDataArray'));
      [
        score,
        cps,
        autosave_checkbox.checked,
        overall_play_minutes,
        overall_play_hours,
        overall_clicked_times
      ] = GameDataArrayStorage || GameDataArray;
    }
  score_counter.innerHTML = `Count is ${score}`;
  overall_main_button_clicked_times.innerHTML = `Overall button click times: ${overall_clicked_times}`;
  overall_playtime_dom.innerHTML = `Overall Playtime: ${overall_play_hours} hours, ${overall_play_minutes} minutes`;
}

export function PlayTime() {
  const overall_playtime_dom = document.getElementById("overall-play-time");
  const PlayTimeAddTrigger = () => {
    overall_play_minutes += 1;
    if (overall_play_minutes % 60 == 0 && overall_play_minutes !== 0) {
      overall_play_hours += 1;
      overall_play_minutes = 0;
    }
    console.log(overall_play_minutes);
    overall_playtime_dom.innerHTML = `Overall Playtime: ${overall_play_hours} hours, ${overall_play_minutes} minutes`;
  }
  setInterval(PlayTimeAddTrigger, 60000);
}

export function GameDataRemove(element) {
  const GameDataRemoveTrigger = () => {
    const GameDataRemoveConfirm = confirm("本当にリセットしますか?");
    if (GameDataRemoveConfirm) {
      const SecondFactorGameDataRemoveConfirm = confirm("本当に本当にリセットしますか?");
      if (SecondFactorGameDataRemoveConfirm) {
        localStorage.removeItem('GameDataArray');
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
    const GameDataArray = 
      [
        score,
        cps,
        autosave_checkbox.checked,
        overall_play_minutes,
        overall_play_hours,
        overall_clicked_times
      ];
    const GameDataArrayJSON = JSON.stringify(GameDataArray);
    localStorage.setItem('GameDataArray', GameDataArrayJSON);
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
