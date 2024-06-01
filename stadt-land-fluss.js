const ANIMATION_TIME = 500;
const COUNTDOWN_TIME = 60;
const ALPHABET = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const buchstabe = document.getElementById('buchstabe');
const countdown = document.getElementById('countdown');
const countdownButton = document.getElementById('countdown-button');
const used = document.getElementById('used');
const menuButton = document.getElementById('toggle-menu');

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
  countdownTime.onclick = () => {
    document.querySelectorAll('.countdown').forEach(button => button.classList.remove('active'));
    countdownTime.classList.add('active');
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
  clearInterval(interval);
  countdown.innerHTML = COUNTDOWN_TIME;

  let timer = COUNTDOWN_TIME, seconds = 0;
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
      const letterIndex = Math.floor(progress * (alphabet.length - 1) + 1);
      buchstabe.innerHTML = alphabet[letterIndex - 1];

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);

    usedLetters.push(nextLetter);
    localStorage.setItem('usedLetters', JSON.stringify(usedLetters));

    setTimeout(() => {
      used.innerHTML = usedLetters.join(' ');
      countdownButton.style.display = "block";
    }, ANIMATION_TIME);
  } else {
    reset();
  }
}