// Constants
const ANIMATION_TIME = 500;
const ALPHABET = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const ANIMATION_LETTERS = ['A', 'U', 'S', 'T', 'F', 'K', 'N', '0', 'D', 'L', 'M', 'B', 'H'];
const STORAGE_KEYS = {
  USED_LETTERS: 'usedLetters',
  EXCLUDED_LETTERS: 'excludedLetters',
  TIMER: 'timer',
  USED_WORDS: 'usedWords',
  WORD_LIST: 'wordList',
  TIMER_WORDS: 'timerWords',
  ACTIVE_PAGE: 'activePage'
};

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

// DOM elements - cached to avoid repeated queries
const elements = {
  buchstabe: document.getElementById('buchstabe'),
  countdown: document.getElementById('countdown'),
  countdownButton: document.getElementById('countdown-button'),
  used: document.getElementById('used'),
  menuButton: document.getElementById('toggle-menu'),
  menu: document.getElementById('menu'),
  resetButton: document.getElementById('reset'),
  form: document.querySelector('form'),
  wordButton: document.getElementById('word-button'),
  countdownWords: document.getElementById('countdown-words'),
  usedWords: document.getElementById('used-words'),
  wordList: document.getElementById('word-list'),
  resetWordsButton: document.getElementById('reset-words'),
  tabs: document.querySelectorAll('.tab'),
  lettersPage: document.getElementById('letters-page'),
  wordsPage: document.getElementById('words-page'),
  lettersSettings: document.getElementById('letters-settings'),
  wordsSettings: document.getElementById('words-settings')
};

// State
let countdownInterval = null;
let currentPage = storage.get(STORAGE_KEYS.ACTIVE_PAGE, 'letters');

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

const resetWords = () => {
  elements.wordButton.classList.remove('started');
  storage.remove(STORAGE_KEYS.USED_WORDS);
  elements.usedWords.innerHTML = '';
  elements.wordButton.innerHTML = 'Go';
  clearCountdown();
};

const animateWord = (targetWord) => {
  let startTimestamp = null;
  const words = getWordList();
  
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    
    const progress = Math.min((timestamp - startTimestamp) / ANIMATION_TIME, 1);
    const wordIndex = Math.floor(Math.random() * words.length);
    elements.wordButton.innerHTML = words[wordIndex] || targetWord;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      elements.wordButton.innerHTML = targetWord;
    }
  };
  
  requestAnimationFrame(step);
};

const getWordList = () => {
  const wordListText = storage.get(STORAGE_KEYS.WORD_LIST, '');
  return wordListText
    .split('\n')
    .map(word => word.trim())
    .filter(word => word.length > 0);
};

const startCountdownWords = () => {
  const timerValue = storage.get(STORAGE_KEYS.TIMER_WORDS, '0');
  clearCountdown();
  
  let timeRemaining = parseInt(timerValue, 10);
  elements.countdownWords.innerHTML = timeRemaining;

  countdownInterval = setInterval(() => {
    timeRemaining--;
    elements.countdownWords.innerHTML = timeRemaining;

    if (timeRemaining <= 0) {
      clearCountdown();
      elements.countdownWords.innerHTML = "Time's up!";
    }
  }, 1000);
};

const selectWord = () => {
  const words = getWordList();
  
  if (words.length === 0) {
    alert('Please add words/names in the settings first.');
    return;
  }

  elements.wordButton.classList.add('started');
  clearCountdown();
  
  const usedWords = storage.get(STORAGE_KEYS.USED_WORDS, []);
  const availableWords = words.filter(word => !usedWords.includes(word));

  if (availableWords.length === 0) {
    resetWords();
    return;
  }

  const shuffledWords = shuffle(availableWords);
  const nextWord = shuffledWords[0];
  
  animateWord(nextWord);

  usedWords.push(nextWord);
  storage.set(STORAGE_KEYS.USED_WORDS, usedWords);

  setTimeout(() => {
    elements.usedWords.innerHTML = usedWords.join(' • ');
    
    const timerValue = storage.get(STORAGE_KEYS.TIMER_WORDS, '0');
    elements.countdownButton.style.opacity = timerValue !== '0' ? '1' : '0';
  }, ANIMATION_TIME);
};

const switchPage = (page) => {
  currentPage = page;
  storage.set(STORAGE_KEYS.ACTIVE_PAGE, page);
  
  // Update tabs
  elements.tabs.forEach(tab => {
    tab.classList.toggle('active', tab.dataset.page === page);
  });
  
  // Update pages
  elements.lettersPage.classList.toggle('active', page === 'letters');
  elements.wordsPage.classList.toggle('active', page === 'words');
  
  // Update settings
  elements.lettersSettings.classList.toggle('active', page === 'letters');
  elements.wordsSettings.classList.toggle('active', page === 'words');
  
  // Update countdown button visibility
  clearCountdown();
  if (page === 'letters') {
    const timerValue = storage.get(STORAGE_KEYS.TIMER, '0');
    elements.countdownButton.style.opacity = elements.buchstabe.classList.contains('started') && timerValue !== '0' ? '1' : '0';
  } else {
    const timerValue = storage.get(STORAGE_KEYS.TIMER_WORDS, '0');
    elements.countdownButton.style.opacity = elements.wordButton.classList.contains('started') && timerValue !== '0' ? '1' : '0';
  }
};

// Initialize
elements.form.onclick = (event) => event.stopPropagation();

elements.resetButton.onclick = () => {
  reset();
  document.body.classList.remove('show-menu');
};

elements.resetWordsButton.onclick = () => {
  resetWords();
  document.body.classList.remove('show-menu');
};

// Timer buttons
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

// Word timer buttons
const selectedTimerWords = storage.get(STORAGE_KEYS.TIMER_WORDS, '0');
document.querySelectorAll('.countdown-words').forEach(button => {
  const timerValue = button.innerHTML;
  
  if (timerValue === selectedTimerWords) {
    button.classList.add('active');
  }

  button.onclick = () => {
    elements.countdownButton.style.opacity = timerValue === '0' ? '0' : '1';
    document.querySelectorAll('.countdown-words').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    storage.set(STORAGE_KEYS.TIMER_WORDS, timerValue);
    clearCountdown();
  };
});

// Word list textarea
elements.wordList.value = storage.get(STORAGE_KEYS.WORD_LIST, '');
elements.wordList.oninput = () => {
  storage.set(STORAGE_KEYS.WORD_LIST, elements.wordList.value);
};

// Tab navigation
elements.tabs.forEach(tab => {
  tab.onclick = () => switchPage(tab.dataset.page);
});

// Event listeners
elements.buchstabe.onclick = selectLetter;
elements.menuButton.onclick = () => document.body.classList.add('show-menu');
elements.menu.onclick = () => document.body.classList.remove('show-menu');
elements.wordButton.onclick = selectWord;
elements.countdownButton.onclick = () => {
  if (currentPage === 'letters') {
    startCountdown();
  } else {
    startCountdownWords();
  }
};

// Initialize page on load
switchPage(currentPage);