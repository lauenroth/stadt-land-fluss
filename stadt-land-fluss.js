const ANIMATION_TIME = 500;
const ALPHABET = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const buchstabe = document.getElementById('buchstabe');
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

buchstabe.onclick = () => {
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
    }, ANIMATION_TIME);
  }
}