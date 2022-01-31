#!/usr/bin/env node

const { readFileSync } = require('fs');
const { join } = require('path');

const { generateStats, main, tests, setDebug } = require('./bot');

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

if (!word) {
  const startDate = new Date('June 19, 2021');
  const wordIndex = Math.floor((new Date() - startDate) / (1000 * 60 * 60 * 24));

  const words = JSON.parse(readFileSync(join(__dirname, '../data/words.json')).toString());
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
}
