// From https://ckhconsulting.com/parsing-large-json-with-nodejs/

const StreamArray = require('stream-json/streamers/StreamArray');
const fs = require('fs');
const { join } = require('path');
const progress = require('progress-stream');

// Make the dumb json valid (add commas and brackets to array)
// $ sed -i 's/}/},/g' yelp_academic_dataset_review.json
// $ sed -i 's/{"review_id":"lWC-xP3rd6obsecCYsGZRg"/\[{"review_id":"lWC-xP3rd6obsecCYsGZRg"/g' yelp_academic_dataset_review.json
// $ sed -i 's/Highly recommend!!","date":"2019-04-17 04:27:39"},/Highly recommend!!","date":"2019-04-17 04:27:39"}]/g' yelp_academic_dataset_review.json
// $ sed -i 's/,,/,/g' yelp_academic_dataset_review.json

const inFile = join(__dirname, '../yelp/yelp_academic_dataset_review.json');
const outFile = join(__dirname, '../yelp/yelp_simple_data.txt');

// Part 1: Word extraction
if (!fs.existsSync(outFile)) {
  const jsonStream = StreamArray.withParser();
  fs.createReadStream(inFile).pipe(jsonStream.input);

  // Wipe old file and restart from scratch
  if (fs.existsSync(outFile)) fs.rmSync(outFile);
  const data = fs.createWriteStream(outFile, { flags: 'a' });

  let counter = 0;

  // Crashes at end, but still gets all of the data - good enough
  jsonStream.on('data', ({ key, value }) => {
    data.write(value.text);

    counter++;
    if (counter % 10000 === 0) console.log(counter);
  });

  jsonStream.on('end', ({ key, value }) => {
    console.log('All Done');

    data.end();
  });
}

// Part 2: Statistics
const mapping = {};
let total = 0;

const stat = fs.statSync(outFile);
const str = progress({
  length: stat.size,
  time: 2000 /* ms */,
});

const outStream = fs.createReadStream(outFile).pipe(str);

outStream.on('data', (chunk) => {
  const split = chunk
    .toString()
    .replace(/[\W_0-9]+/g, ' ')
    .split(/[ !?\-,."'’]/g);

  split.forEach((s) => {
    if (s.length === 5) {
      const w = s.toLowerCase();
      mapping[w] = mapping[w] || 0;
      mapping[w]++;

      total++;

      if (total > 0 && total % 5000000 === 0) {
        console.log(
          total,
          str.progress(),
          Array.from(Object.entries(mapping))
            .sort((a, b) => b[1] - a[1])
            .slice(0, 50)
            .map((e) => [e[0], ((e[1] / total) * 100).toFixed(2) + '%'])
        );
      }
    }
  });
});

outStream.on('end', () => {
  const data = { words: mapping, total };
  fs.writeFileSync(join(__dirname, '../data/stats_yelp.json'), JSON.stringify(data, null, 2));
});
