'use strict';

let balloons = [];
const colors = ['amber', 'blue', 'green', 'purple', 'red'];
let targetColor;
let targetScore;
let timeLeft;
let level = 1;
let running = true;
let letOffBalloons = 0; // reward if it stays zero :)
let popMistakes = 0; // same
let timerId = 0;

const rewards = {
  colorBomb: 0,
  smokeBomb: 0,
  flourBomb: 0
}
const levels = {
  1: {
    targetScore: 10,
    targetColorChangeTime: 10000,
    timeLeft: 30,
    size: {
      min: 1,
      max: 10
    },
    speed: {
      min: 1,
      max: 10
    },
    wind: 0
  },
  2: {
    targetScore: 20,
    timeLeft: 30,
    wind: 0
  },
  3: {
    targetScore: 30,
    timeLeft: 45,
    wind: 1
  },
  4: {
    targetScore: 45,
    timeLeft: 60,
    wind: 1
  },
  5: {
    targetScore: 45,
    timeLeft: 60,
    wind: 2
  },
  6: {
    targetScore: 60,
    timeLeft: 60,
    wind: 2
  },
  7: {
    targetScore: 60,
    timeLeft: 60,
    wind: 3
  }
}

const bg = document.getElementsByClassName('bg')[0];
const timer = document.getElementById('timer');
const colorBomb = document.getElementById('color-bomb');
const colorBombAmt = colorBomb.getElementsByClassName('amount')[0];
const flourBomb = document.getElementById('flour-bomb');
const flourBombAmt = flourBomb.getElementsByClassName('amount')[0];
const smokeBomb = document.getElementById('smoke-bomb');
const smokeBombAmt = smokeBomb.getElementsByClassName('amount')[0];


function setup() {

  // check device aspect ratio and set it to portrait all the time???

  const height = windowHeight - windowHeight / 10;
  const width = (windowHeight / windowWidth > 1) ? windowWidth : windowHeight * height / windowWidth;

  const canvas = createCanvas(width, height, 'p5');
  canvas.parent('p5');

  nextLevel();

  updateRewards();
  changeTargetColor();
  bg.innerHTML = 'Pop <span>' + targetScore + '</span> more';

  setInterval(changeTargetColor, 10000);
  timerId = setInterval(updateTimer, 1000);

  smokeBomb.addEventListener('click', popAllOthers);
  colorBomb.addEventListener('click', popAllTarget);
}

function draw() {
  clear();
  noStroke();

  if (running) {

    if (random(100) < 5) {
      balloons.push(new Balloon(random(width), height + windowHeight / 20, levels[level].wind));
    }
    if (random(1000) < 1) {
      // let's make more smokeBombs
      updateRewards(random(['colorBomb', 'smokeBomb', 'smokeBomb', 'smokeBomb']), 1);
    }
    if (targetScore <= 0) {
      running = false;
      clearInterval(timerId);
      // disable popping more or just not let score be below 0
      bg.innerHTML = 'You <span>DID</span> it!';
    }
  }

  for (let i = balloons.length - 1; i >= 0; i--) {
    balloons[i].update();
    balloons[i].show();

    if (balloons[i].isOffCanvas()) {
      if (balloons[i].colorName === targetColor) {
        letOffBalloons += 1;
      }
      balloons.splice(i, 1);
    }
  }

  // @todo should remove them if they're off canvas
  if(balloons.length > 50) { balloons.splice(0, 1) };
}

function mousePressed() {
	for (let i = 0; i < balloons.length; i++) {
    if (balloons[i].pop()) {
      if (balloons[i].colorName === targetColor) {
        targetScore -= 1;
      }
      else {
        popMistakes += 1;
        targetScore += 2;
      }
      balloons.splice(i, 1);
    }
    updateScore();
  }
}

function popAllTarget() {
  if (rewards.colorBomb > 0) {

    updateRewards('colorBomb', -1);

    for (let i = balloons.length - 1; i >=0; i--) {
      if (balloons[i].colorName === targetColor) {
        targetScore -= 1;
        balloons.splice(i, 1);
      }
    }
    updateScore();
  }
}

function popAllOthers() {
  if (rewards.smokeBomb > 0) {

    updateRewards('smokeBomb', -1);

    for (let i = balloons.length - 1; i >=0; i--) {
      if (balloons[i].colorName !== targetColor) {
        balloons.splice(i, 1);
      }
    }
    updateScore();
  }
}

function updateScore() {
  bg.innerHTML = 'Pop <span>' + targetScore + '</span> more';
}

function changeTargetColor() {
  targetColor = random(colors);
  document.body.classList = '';
  document.body.classList.add(targetColor);
}

function updateRewards(bomb, add) {

  if (arguments.length === 2) {
    rewards[bomb] += add;
  }

  for (let i = 0; i < Object.keys(rewards).length; i++) {
    if (rewards[Object.keys(rewards)[i]] > 0) {
      window[Object.keys(rewards)[i]].classList.add('available');
    }
    else {
     window[Object.keys(rewards)[i]].classList.remove('available');
    }
  }

  colorBombAmt.textContent = rewards.colorBomb;
  smokeBombAmt.textContent = rewards.smokeBomb;
  flourBombAmt.textContent = rewards.flourBomb;
}

function nextLevel() {
  // check if it's max level
  level += 1;
  targetScore = levels[level].targetScore;
  timeLeft = levels[level].timeLeft;
}

function updateTimer() {
  timeLeft -= 1;
  timer.textContent = formatTime(timeLeft);
}

function formatTime(secs) {
  const mins = ('0' + Math.floor(secs / 60)).slice(-2);
  secs = ('0' + (secs % 60)).slice(-2);

  return `${mins}:${secs}`;
}
