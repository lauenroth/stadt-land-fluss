const ANIMATION_TIME = 500;
const ALPHABET = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const ANIMATION_LETTERS = ['A', 'U', 'S', 'T', 'F', 'K', 'N', '0', 'D', 'L', 'M', 'B', 'H'];
const buchstabe = document.getElementById('buchstabe');
const countdown = document.getElementById('countdown');
const countdownButton = document.getElementById('countdown-button');
const used = document.getElementById('used');
const menuButton = document.getElementById('toggle-menu');
const menu = document.getElementById('menu');
const resetButton = document.getElementById('reset');

// initialize
localStorage.removeItem('usedLetters');
document.querySelector('form').onclick = event => event.stopPropagation();


const shuffle = (array) => {
  let count = array.length,
    randomnumber,
    temp;
  while (count) {
    randomnumber = Math.random() * count-- | 0;
    temp = array[count];
    array[count] = array[randomnumber];
    array[randomnumber] = temp
  }
  return array;
};

const reset = () => {
  buchstabe.classList.remove("started");
  localStorage.removeItem('usedLetters');
  used.innerHTML = '';
  buchstabe.innerHTML = 'Go';
}

resetButton.onclick = () => {
  reset();
  document.body.classList.remove('show-menu');
};

const selectedTimer = localStorage.getItem('timer') || '0';
document.querySelectorAll('.countdown').forEach(countdownTime => {
  if (countdownTime.innerHTML === selectedTimer) {
    countdownTime.classList.add('active');
  }

  countdownTime.onclick = () => {
    const timer = countdownTime.innerHTML;
    countdownButton.style.opacity = timer === '0' ? 0 : 1;
    document.querySelectorAll('.countdown').forEach(button => button.classList.remove('active'));
    countdownTime.classList.add('active');
    localStorage.setItem('timer', timer)
    clearInterval(interval);
    countdown.innerHTML = '';
  }
});

const excludedLetters = JSON.parse(localStorage.getItem('excludedLetters')) || [];
document.querySelectorAll('.letter').forEach(letter => {

  if (excludedLetters.indexOf(letter.innerHTML) !== -1) {
    letter.classList.add('disabled');
  }

  letter.onclick = () => {
    letter.classList.toggle('disabled');

    const indexOfLetter = excludedLetters.indexOf(letter.innerHTML);

    if (indexOfLetter === -1) {
      excludedLetters.push(letter.innerHTML);
    } else {
      excludedLetters.splice(indexOfLetter, 1);
    }
    localStorage.setItem('excludedLetters', JSON.stringify(excludedLetters));
  }
});

menuButton.onclick = () => {
  document.body.classList.add('show-menu');
}

menu.onclick = () => {
  document.body.classList.remove('show-menu');
}

countdownButton.onclick = () => {
  const countdownTime = localStorage.getItem('timer')
  clearInterval(interval);
  countdown.innerHTML = countdownTime;

  let timer = countdownTime;
  interval = setInterval(function () {
      countdown.innerHTML = timer - 1;

      if (--timer <= 0) {
          clearInterval(interval);
          countdown.innerHTML = "Time's up!";
      }
  }, 1000);

}

let interval;
buchstabe.onclick = () => {
  buchstabe.classList.add("started");
  clearInterval(interval);
  countdown.innerHTML = "";
  const usedLetters = JSON.parse(localStorage.getItem('usedLetters')) || [];
  const excludedLetters = JSON.parse(localStorage.getItem('excludedLetters')) || [];

  const alphabet = shuffle(ALPHABET.filter(letter => !usedLetters.includes(letter) && !excludedLetters.includes(letter)));

  if (alphabet.length > 0) {

    const nextLetter = alphabet[alphabet.length - 1];
    
    // animate letters
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) {
        startTimestamp = timestamp;
      }
      const progress = Math.min((timestamp - startTimestamp) / ANIMATION_TIME, 1);
      const letterIndex = Math.floor(progress * (ANIMATION_LETTERS.length - 1) + 1);
      buchstabe.innerHTML = ANIMATION_LETTERS[letterIndex - 1];

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        buchstabe.innerHTML = nextLetter;
      }
    };
    window.requestAnimationFrame(step);

    usedLetters.push(nextLetter);
    localStorage.setItem('usedLetters', JSON.stringify(usedLetters));

    setTimeout(() => {
      used.innerHTML = usedLetters.join(' ');

      if (localStorage.getItem('timer') > 0) {
        countdownButton.style.opacity = 1;
      }
    }, ANIMATION_TIME);
  } else {
    reset();
  }
}