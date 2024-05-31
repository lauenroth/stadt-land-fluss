const ANIMATION_TIME = 500;
const COUNTDOWN_TIME = 10;
const ALPHABET = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const buchstabe = document.getElementById('buchstabe');
const countdown = document.getElementById('countdown');
const countdownButton = document.getElementById('countdown-button');
const used = document.getElementById('used');

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

let interval;

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

buchstabe.onclick = () => {
  buchstabe.classList.add("started");
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
  }
}