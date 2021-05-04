const alphabetContainer = document.querySelector('.alphabet-container');
const buttonStartAndPause = document.querySelector('.button-start-and-pause');
const buttonReset = document.querySelector('.button-reset');

// keep count of how many times each letter said
const letterCount = {
  a: 0,
  b: 0,
  c: 0,
  d: 0,
  e: 0,
  f: 0,
  g: 0,
  h: 0,
  i: 0,
  j: 0,
  k: 0,
  l: 0,
  m: 0,
  n: 0,
  o: 0,
  p: 0,
  q: 0,
  r: 0,
  s: 0,
  t: 0,
  u: 0,
  v: 0,
  w: 0,
  x: 0,
  y: 0,
  z: 0
};

let recognizing = false;

window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

// Make a new speech recogn
const recognition = new SpeechRecognition();
recognition.continuous = true;
// recognition.interimResults = true;

// debounce function
const debounce = (callback, wait) => {
  let timeoutId = null;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback.apply(null, args);
    }, wait);
  };
};

function start() {
  if (!('SpeechRecognition' in window)) {
    alphabetContainer.style.fontSize = '20px';
    alphabetContainer.innerHTML =
      'Sorry, your browser does not support speech recognition.';
    return;
  }
  // it does work
  console.log('Starting...');
}
start();

// calculate opacity
function calculateOpacity(score) {
  if (score > 50) {
    return 1;
  }
  return score / 100 + 0.5;
}

// change css styling of the letters based on the count for each letter
function changeStyles(letter, score) {
  const letterEl = document.querySelector(`.char-${letter}`);
  letterEl.style.fontSize = `${12 + score * 5}px`;
  letterEl.style.opacity = `${calculateOpacity(score)}`;
}

function handleResult({ results }) {
  // get last child of results..
  const wordsResults = results[results.length - 1][0].transcript;
  // lowercase everything
  let word = wordsResults.toLowerCase();
  // strip spaces
  word = word.replace(/\s/g, '');
  // for each char in the word, add count to the letter
  for (const c of word) {
    // check if alphabet Char
    if (letterCount[c] !== undefined) {
      letterCount[c] += 1;
      const letterScore = letterCount[c];
      // change CSS styling based on score
      changeStyles(c, letterScore);
    }
  }
}

function startCount() {
  recognition.onresult = handleResult;
  recognition.start();
  recognizing = true;
  buttonStartAndPause.innerHTML = '<i class="fas fa-pause"></i>';
  buttonStartAndPause.style.background = '#ff4161';
}

function pauseCount() {
  recognition.stop();
  recognizing = false;
  buttonStartAndPause.innerHTML = '<i class="fas fa-play"></i>';
  buttonStartAndPause.style.background = '#1ff366';
}

function handleStartAndPause() {
  if (recognizing === false) {
    startCount();
  } else {
    pauseCount();
  }
}

function resetCount() {
  recognition.stop();
  recognizing = false;
  buttonStartAndPause.innerHTML = '<i class="fas fa-play"></i>';
  buttonStartAndPause.style.background = '#1ff366';
  Object.keys(letterCount).forEach(i => {
    letterCount[i] = 0;
    changeStyles(i, 0);
  });
}

buttonStartAndPause.addEventListener(
  'click',
  debounce(handleStartAndPause, 300)
);
buttonReset.addEventListener('click', resetCount);
