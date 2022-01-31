const { readFileSync } = require('fs');
const { join } = require('path');

// Word list pulled directly from wordle code (maybe this is cheating by having a different scope of words, but hey this is for fun and
// makes it less annoying to handle "non-words" - i.e. words that don't exist in the wordle dictionary)
const words = JSON.parse(readFileSync(join(__dirname, '../data/words.json')).toString());
const bookStats = JSON.parse(readFileSync(join(__dirname, '../data/stats.json')).toString());
const yelpStats = JSON.parse(readFileSync(join(__dirname, '../data/stats_yelp.json')).toString());

let debug = false;

function setDebug(debugMode) {
  debug = debugMode;
}

function generateStats() {
  const mapping = {};
  let total = 0;

  words.dictionary.forEach((w) => {
    for (let i = 0; i < w.length; i++) {
      const letter = w[i].toLowerCase();
      mapping[letter] = mapping[letter] || 0;
      mapping[letter]++;

      total++;
    }
  });

  // Generate a score for each word based on the statistical usefullness of each letter
  // TODO: Make this also read through real text and find the likelihood of usage in real life
  let min = 9999999999;
  let max = 0;
  let avg = 0;

  const scores = {};
  words.dictionary.forEach((w, i) => {
    const letterScore = (w.split('').reduce((prev, current) => (prev += mapping[current]), 0) / total) * 100;
    const bookScore = ((bookStats.words[w] || -1) / bookStats.total) * 1000;
    const yelpScore = ((yelpStats.words[w] || -1) / yelpStats.total) * 1000;

    let score = letterScore * 0.0 + bookScore * 0.5 + yelpScore * 0.5;
    // score = yelpScore;

    scores[w] = score;

    if (score > max) max = score;
    if (score < min) min = score;
    avg += score;
  });

  avg /= words.dictionary.length;

  // console.log(scores, min, max, avg);

  return { mapping, total, scores };
}

function main(stats, answer) {
  // Choose random word from dictionary
  const wordlist = words.answers;
  const randomNumber = Math.floor(Math.random() * wordlist.length);
  if (!answer) answer = wordlist[randomNumber];
  if (debug) console.log(`Answer is "${answer}"\n`);

  if (answer.length !== 5) {
    console.error('Wrong length word!', answer.length);
    return;
  }

  const progress = [];
  const known = {};
  const incorrect = new Set();
  const guessed = new Set();
  let guesses = 0;
  let correct = false;

  let possible = ['aeros'];
  // let possible = findPossible(known, Array.from(incorrect), false, guessed, stats);

  while (possible.length > 0 && guesses < 6 && !correct) {
    guesses++;
    if (debug)
      console.log(`${guesses}: All possible (${possible.length}):`, possible.map((p) => `${p}: ${stats.scores[p]}`).slice(0, 10), '\n');

    const guess = possible[0];
    if (debug) console.log(`Checking word "${guess}"`);

    if (guess === answer) {
      possible = [answer];
      correct = true;
      progress.push({ guess: answer, results: '🟩 🟩 🟩 🟩 🟩' });
      if (debug) console.log('Got correct answer!');
    } else {
      checkWord(guess, answer, known, incorrect, progress);

      if (debug) console.log('Known', known, '\nIncorrect', Array.from(incorrect), '\n');

      guessed.add(guess);

      let fullyKnown = 0;
      Object.values(known).forEach((v) => {
        if (v.size) fullyKnown += v.size;
      });

      possible = findPossible(known, Array.from(incorrect), fullyKnown > 0 || guesses > 3, guessed, stats);
    }
  }

  if (debug) {
    if (correct) console.log(`After ${guesses} guesses, got the correct word: "${possible[0]}"`);
    else console.log(`Did not find solution for: ${answer}`);
  }

  return { correct, guesses, answer, progress };
}

function findPossible(known, incorrect, duplicateLetters, guessed, stats) {
  const matches = [];

  words.dictionary.forEach((w) => {
    let valid = true;

    if (!duplicateLetters) {
      // Code bit from https://www.codegrepper.com/code-examples/javascript/find+duplicate+characters+from+string+in+javascript
      const text = w.split('');
      const duplicate = text.some((v, i, a) => {
        return a.lastIndexOf(v) !== i;
      });

      if (duplicate) valid = false;
    }

    if (guessed.has(w)) valid = false;

    incorrect.forEach((l) => {
      if (w.indexOf(l) !== -1) valid = false;
    });

    Object.entries(known).forEach((l) => {
      const letter = l[0];
      const value = l[1];

      // Only know that the letter exists in the word, but doesn't exist in checked word
      if (value === -1 && w.indexOf(letter) === -1) valid = false;

      // Know actual placement of letter (at least one instance) in the word
      if (value !== -1) {
        Array.from(value).forEach((knownLetter) => {
          if (w[knownLetter] !== letter) valid = false;
        });
      }
    });

    if (valid) matches.push(w);
  });

  // Generate scores for words and choose best option
  matches.sort((a, b) => {
    return stats.scores[b] - stats.scores[a];
  });

  return matches;
}

function checkWord(guess, answer, known, incorrect, progress) {
  let results = '';

  guess.split('').forEach((l, i) => {
    if (l === answer[i]) {
      if (known[l] && known[l] !== -1) known[l].add(i);
      else known[l] = new Set([i]);

      results += '🟩 ';
    } else if (answer.indexOf(l) !== -1) {
      known[l] = -1;
      results += '🟨 ';
    } else {
      incorrect.add(l);
      results += '⬛ ';
    }
  });

  progress.push({ guess, results });
}

function tests() {
  const stats = generateStats();
  const wordlist = words.answers
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

  const results = [];

  wordlist.forEach((w, i) => {
    results.push(main(stats, w));

    if (i > 0 && (i + 1) % 10 === 0) {
      printTestResults(results);
    }
  });

  printTestResults(results);
}

function printTestResults(results) {
  let avg = 0;
  let solved = 0;
  results.forEach((r) => {
    if (r.correct) {
      avg += r.guesses;
      solved++;
    }
  });

  console.log(
    `Solved: ${solved}/${results.length} (${((solved / results.length) * 100).toFixed(1)}%), Avg Guesses: ${(avg / solved).toFixed(2)}`
  );
}

module.exports = { generateStats, main, setDebug, tests };
