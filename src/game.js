const gameState = {
  score: 0,
  cps: 1,
  stats: {
    minutes: 0,
    hours: 0,
    totalClicks: 0
  },
  settings: {
    autosave: false
  }
};

export function MainButtonClick(element) {
  const MainButtonClickTrigger = () => {
    gameState.score += gameState.cps;
    gameState.stats.totalClicks += 1;
    document.getElementById("score-counter").innerHTML = `Count is ${gameState.score}`;
    document.getElementById("overall-main-button-clicked-times").innerHTML = `Overall button click times: ${gameState.stats.totalClicks}`;
  }
  element.addEventListener('click', MainButtonClickTrigger);
}

export function GameDataManage(SaveElement, RemoveElement) {
  const load = () => {
    const savedData = localStorage.getItem('GameData');
    if (savedData) {
      Object.assign(gameState, JSON.parse(savedData));
    }
    if (gameState.settings.autosave) {
      document.getElementById("autosave-checkbox").checked = true;
    } else {
      document.getElementById("autosave-checkbox").checked = false;
    }
    document.getElementById("score-counter").innerHTML = `Count is ${gameState.score}`;
    document.getElementById("overall-main-button-clicked-times").innerHTML = `Overall button click times: ${gameState.stats.totalClicks}`;
    document.getElementById("overall-play-time").innerHTML = `Overall Playtime: ${gameState.stats.hours} hours, ${gameState.stats.minutes} minutes`;
  }
  window.addEventListener('load', load);

  const save = () => {
    localStorage.setItem('GameData', JSON.stringify(gameState));
    CreateNotification("saved_dialog", "Saved.");
  }
  SaveElement.addEventListener('click', save);

  const remove = () => {
    const GameDataRemoveConfirm = confirm("本当にリセットしますか?");
    if (GameDataRemoveConfirm) {
      const SecondFactorGameDataRemoveConfirm = confirm("本当に本当にリセットしますか?");
      if (SecondFactorGameDataRemoveConfirm) {
        localStorage.removeItem('GameData');
        location.reload();
      }
    }
  }
  RemoveElement.addEventListener('click', remove);

  let AutoSaveInterval;
  const autosave_checkbox = document.getElementById("autosave-checkbox");
  const autosave = () => {
    if (autosave_checkbox.checked) {
      AutoSaveInterval = setInterval(save, 60000);
      gameState.settings.autosave = true;
    } else {
      clearInterval(AutoSaveInterval);
      gameState.settings.autosave = false;
    }
  }
  autosave_checkbox.addEventListener('click', autosave);
  window.addEventListener('load', autosave);
}

window.onload = function() {
  (function PlayTime() {
    const PlayTimeAddTrigger = () => {
      gameState.stats.minutes += 1;
      if (gameState.stats.minutes % 60 == 0 && gameState.stats.minutes !== 0) {
        gameState.stats.hours += 1;
        gameState.stats.minutes = 0;
      }
      document.getElementById("overall-play-time").innerHTML = `Overall Playtime: ${gameState.stats.hours} hours, ${gameState.stats.minutes} minutes`;
    }
    setInterval(PlayTimeAddTrigger, 60000);
  }());
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
