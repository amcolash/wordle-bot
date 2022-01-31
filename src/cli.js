#!/usr/bin/env node

const { readFileSync } = require('fs');
const { join } = require('path');
const fetch = require('node-fetch');

const { generateStats, main, tests, setDebug } = require('./bot');

const words = JSON.parse(readFileSync(join(__dirname, '../data/words.json')).toString());

const argv = require('yargs')
  .scriptName('wordle-bot')
  .usage('$0 [args] [word]')

  .boolean('test')
  .alias('t', 'test')
  .describe('t', 'Toggle testing all answers for stats')

  .boolean('debug')
  .alias('d', 'debug')
  .describe('d', 'Toggle debug messages')

  .boolean('random')
  .alias('r', 'random')
  .describe('r', 'Use random word')

  .help('h')
  .alias('h', 'help').argv;

const debug = argv.debug || false;
const testMode = argv.test || false;
let word = argv._[0];
let wordIndex;

if (!word) {
  const startDate = new Date('June 19, 2021 UTC');
  wordIndex = Math.floor((new Date() - startDate) / (1000 * 60 * 60 * 24));
  word = words.answers[wordIndex];
}
if (argv.random) word = undefined;

setDebug(debug);
const stats = generateStats();

if (testMode) {
  tests();
} else {
  const results = main(stats, word);
  console.log(results);

  const key = process.env.IFTTT_TOKEN;
  if (key) {
    const event = 'wordle-bot';
    const notifUrl = `https://maker.ifttt.com/trigger/${event}/with/key/${key}`; // TODO: Env Var

    const notification = `Wordle ${wordIndex || words.answers.indexOf(word) || ''}, ${results.correct ? 'I got it!' : 'Dang, I failed!'} ${
      results.guesses
    }/6\n${results.progress.map((p) => p.results).join('\n')}`;

    console.log(`Sending notification:\n${notification}`);

    fetch(notifUrl, {
      method: 'post',
      body: JSON.stringify({ value1: notification }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.text())
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
  }
}
