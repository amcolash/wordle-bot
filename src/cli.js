#!/usr/bin/env node

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

  .help('h')
  .alias('h', 'help').argv;

const debug = argv.debug || false;
const testMode = argv.test || false;
const word = argv._[0];

setDebug(debug);
const stats = generateStats();

if (testMode) {
  tests();
} else {
  const results = main(stats, word);
  console.log(results);
}
