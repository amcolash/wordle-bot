const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const baseUrl = 'https://www.gutenberg.org/files/X/X-0.txt';

const root = path.join(__dirname, '../gutenburg/');
fs.mkdirSync(root, { recursive: true });

for (let i = 1; i < 1000; i++) {
  const url = baseUrl.replace(/X/g, i);

  fetch(url)
    .then(async (response) => {
      if (response.ok) {
        return response.text();
      } else {
        throw '404';
      }
    })
    .then((text) => {
      const file = path.join(root, `${i}.txt`);
      fs.writeFile(file, text, (err) => {
        if (err) console.error(err);
      });
    })
    .catch((err) => {
      console.error('ERROR', err);
    });
}
