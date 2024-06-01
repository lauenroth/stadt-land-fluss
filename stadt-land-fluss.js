const ANIMATION_TIME = 500;
const ALPHABET = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const ANIMATION_LETTERS = ['A', 'W', 'S', 'T', 'F', 'K', 'N', '0', 'D', 'L'];
const buchstabe = document.getElementById('buchstabe');
const countdown = document.getElementById('countdown');
const countdownButton = document.getElementById('countdown-button');
const used = document.getElementById('used');
const menuButton = document.getElementById('toggle-menu');

// initialize
localStorage.removeItem('usedLetters');


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

document.querySelectorAll('.countdown').forEach(countdownTime => {
  if (countdownTime.innerHTML === localStorage.getItem('timer')) {
    countdownTime.classList.add('active');
  }

  countdownTime.onclick = () => {
    countdownButton.style.display = 'none';
    document.querySelectorAll('.countdown').forEach(button => button.classList.remove('active'));
    countdownTime.classList.add('active');
    localStorage.setItem('timer', countdownTime.innerHTML)
    clearInterval(interval);
    countdown.innerHTML = '';
  }
});

document.querySelectorAll('.letter').forEach(letter => {
  letter.onclick = () => {
    letter.classList.toggle('disabled');
  }
});

menuButton.onclick = () => {
  document.body.classList.toggle('show-menu');
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

  const alphabet = shuffle(ALPHABET.filter(letter => !usedLetters.includes(letter)));

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
        countdownButton.style.display = "block";
      }
    }, ANIMATION_TIME);
  } else {
    reset();
  }
}