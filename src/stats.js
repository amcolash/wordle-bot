const fs = require('fs');
const path = require('path');

const mapping = {};

const dir = path.join(__dirname, '../gutenburg');
const files = fs.readdirSync(dir);

let total = 0;

files.forEach((f) => {
  const file = path.join(dir, f);

  console.log('Reading', file);

  const text = fs.readFileSync(file).toString();

  const split = text.replace(/[\W_0-9]+/g, ' ').split(/[ !?\-,."'’]/g);

  split.forEach((s) => {
    if (s.length === 5) {
      const w = s.toLowerCase();
      mapping[w] = mapping[w] || 0;
      mapping[w]++;

      total++;
    }
  });
});

const data = { words: mapping, total };
fs.writeFileSync(path.join(__dirname, '../data/stats.json'), JSON.stringify(data, null, 2));

console.log('\nTotal words found:', Object.keys(mapping).length);

// console.log(
//   Array.from(Object.entries(mapping))
//     .sort((a, b) => b[1] - a[1])
//     .map((e) => [e[0], ((e[1] / total) * 100).toFixed(2) + '%'])
// );
