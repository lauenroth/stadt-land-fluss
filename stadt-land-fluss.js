// Constants
const ANIMATION_TIME = 500;
const ALPHABET = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const ANIMATION_LETTERS = ['A', 'U', 'S', 'T', 'F', 'K', 'N', '0', 'D', 'L', 'M', 'B', 'H'];
const STORAGE_KEYS = {
  USED_LETTERS: 'usedLetters',
  EXCLUDED_LETTERS: 'excludedLetters',
  TIMER: 'timer'
};

// DOM elements - cached to avoid repeated queries
const elements = {
  buchstabe: document.getElementById('buchstabe'),
  countdown: document.getElementById('countdown'),
  countdownButton: document.getElementById('countdown-button'),
  used: document.getElementById('used'),
  menuButton: document.getElementById('toggle-menu'),
  menu: document.getElementById('menu'),
  resetButton: document.getElementById('reset'),
  form: document.querySelector('form')
};

// State
let countdownInterval = null;

// Helper functions for localStorage operations
const storage = {
  get: (key, defaultValue = null) => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  },
  set: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove: (key) => {
    localStorage.removeItem(key);
  }
};

// Fisher-Yates shuffle with modern syntax
const shuffle = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const clearCountdown = () => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
  elements.countdown.innerHTML = '';
};

const reset = () => {
  elements.buchstabe.classList.remove('started');
  storage.remove(STORAGE_KEYS.USED_LETTERS);
  elements.used.innerHTML = '';
  elements.buchstabe.innerHTML = 'Go';
  clearCountdown();
};

const animateLetter = (targetLetter) => {
  let startTimestamp = null;
  
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    
    const progress = Math.min((timestamp - startTimestamp) / ANIMATION_TIME, 1);
    const letterIndex = Math.floor(progress * ANIMATION_LETTERS.length);
    elements.buchstabe.innerHTML = ANIMATION_LETTERS[Math.min(letterIndex, ANIMATION_LETTERS.length - 1)];

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      elements.buchstabe.innerHTML = targetLetter;
    }
  };
  
  requestAnimationFrame(step);
};

const startCountdown = () => {
  const timerValue = storage.get(STORAGE_KEYS.TIMER, '0');
  clearCountdown();
  
  let timeRemaining = parseInt(timerValue, 10);
  elements.countdown.innerHTML = timeRemaining;

  countdownInterval = setInterval(() => {
    timeRemaining--;
    elements.countdown.innerHTML = timeRemaining;

    if (timeRemaining <= 0) {
      clearCountdown();
      elements.countdown.innerHTML = "Time's up!";
    }
  }, 1000);
};

const selectLetter = () => {
  elements.buchstabe.classList.add('started');
  clearCountdown();
  
  const usedLetters = storage.get(STORAGE_KEYS.USED_LETTERS, []);
  const excludedLetters = storage.get(STORAGE_KEYS.EXCLUDED_LETTERS, []);
  const availableLetters = ALPHABET.filter(
    letter => !usedLetters.includes(letter) && !excludedLetters.includes(letter)
  );

  if (availableLetters.length === 0) {
    reset();
    return;
  }

  const shuffledLetters = shuffle(availableLetters);
  const nextLetter = shuffledLetters[0];
  
  animateLetter(nextLetter);

  usedLetters.push(nextLetter);
  storage.set(STORAGE_KEYS.USED_LETTERS, usedLetters);

  setTimeout(() => {
    elements.used.innerHTML = usedLetters.join(' ');
    
    const timerValue = storage.get(STORAGE_KEYS.TIMER, '0');
    elements.countdownButton.style.opacity = timerValue !== '0' ? '1' : '0';
  }, ANIMATION_TIME);
};

// Initialize
elements.form.onclick = (event) => event.stopPropagation();

elements.resetButton.onclick = () => {
  reset();
  document.body.classList.remove('show-menu');
};

const selectedTimer = storage.get(STORAGE_KEYS.TIMER, '0');
document.querySelectorAll('.countdown').forEach(button => {
  const timerValue = button.innerHTML;
  
  if (timerValue === selectedTimer) {
    button.classList.add('active');
  }

  button.onclick = () => {
    elements.countdownButton.style.opacity = timerValue === '0' ? '0' : '1';
    document.querySelectorAll('.countdown').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    storage.set(STORAGE_KEYS.TIMER, timerValue);
    clearCountdown();
  };
});

const excludedLetters = storage.get(STORAGE_KEYS.EXCLUDED_LETTERS, []);
document.querySelectorAll('.letter').forEach(button => {
  const letter = button.innerHTML;
  
  if (excludedLetters.includes(letter)) {
    button.classList.add('disabled');
  }

  button.onclick = () => {
    button.classList.toggle('disabled');
    
    const index = excludedLetters.indexOf(letter);
    if (index === -1) {
      excludedLetters.push(letter);
    } else {
      excludedLetters.splice(index, 1);
    }
    
    storage.set(STORAGE_KEYS.EXCLUDED_LETTERS, excludedLetters);
  };
});

// Event listeners
elements.buchstabe.onclick = selectLetter;
elements.countdownButton.onclick = startCountdown;
elements.menuButton.onclick = () => document.body.classList.add('show-menu');
elements.menu.onclick = () => document.body.classList.remove('show-menu');