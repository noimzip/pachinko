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
    localStorage.setItem('score', score);
  }
  element.addEventListener('click', Count);
}

window.onload = function() {
  const storage_score = parseInt(localStorage.getItem('score')) || 0;
  score = storage_score;
  counter.innerHTML = `Count is ${score}`;
}

function isMultipleOfTen(number) {
  if (number % 10 === 0) {
    console.log("level_up")
  }
}

function level_up_check() {
}
