const { createReadStream, createWriteStream, mkdirSync, readdirSync, existsSync, writeFileSync } = require('fs');
const fetch = require('node-fetch');
const { join } = require('path');
const { Parse } = require('unzipper');
const json5 = require('json5');

require('dotenv').config();

const perPage = 100;

const githubUrl = 'https://api.github.com';
const actionsEndpoint = `${githubUrl}/repos/amcolash/wordle-bot/actions/runs?per_page=${perPage}`;

const headers = {
  Authorization: `token ${process.env.GITHUB_TOKEN}`,
};

async function getData() {
  // Set things up
  const dataDir = join(__dirname, '/data');
  mkdirSync(dataDir, { recursive: true });

  let page = 0;
  let morePages = true;

  // Query github for all pages of action runs
  console.log('Getting all run data');

  const allData = [];
  while (morePages) {
    page++;

    const data = await fetch(`${actionsEndpoint}&page=${page}`, { headers })
      .then((data) => {
        if (data.status !== 200) {
          throw `Error in fetch, exiting now. Staus: ${data.status}, ${data.statusText}`;
        }
        return data.json();
      })
      .catch((err) => {
        console.error(err);
        morePages = false;
      });

    if (data) {
      allData.push(...data.workflow_runs);

      if (page * perPage > data.total_count) morePages = false;
    }
  }

  // Get logs for each action run
  console.log('Getting logs for each run');

  const toDownload = allData.filter((run) => {
    const fileName = join(dataDir, `/logs_${run.run_number}.zip`);
    return run.run_number > 6 && run.conclusion === 'success' && !existsSync(fileName);
  });

  console.log(`Going to download ${toDownload.length} files`);

  await Promise.all(
    toDownload.map((run) => {
      const fileName = join(dataDir, `/logs_${run.run_number}.zip`);
      return fetch(run.logs_url, { headers })
        .then((data) => {
          if (data.status !== 200) {
            throw `Error in fetch, exiting now. Staus: ${data.status}, ${data.statusText}`;
          }

          return data.body.pipe(createWriteStream(fileName));
        })
        .catch((err) => console.error(err));
    })
  );

  const output = [];

  const files = readdirSync(dataDir).filter((f) => f.indexOf('.zip') !== -1);

  console.log(`Reading ${files.length} log archives`);

  for (const f of files) {
    if (f.indexOf('.zip') !== -1) {
      const file = join(dataDir, f);

      await new Promise((resolve) => {
        createReadStream(file)
          .pipe(Parse())
          .on('entry', async (entry) => {
            const fileName = entry.path;

            if (fileName.indexOf('Solve wordle.txt') !== -1) {
              const contents = (await entry.buffer()).toString();
              const rows = contents
                .trim()
                .split('\n')
                .map((r) => r.substring(r.indexOf('Z') + 1).trim());

              let startJson = -1;
              let endJson = -1;

              const didNotFind = rows.findIndex((r) => r.indexOf('Did not find solution') !== -1);
              const correct = rows.findIndex((r) => r.indexOf('Got correct answer!') !== -1);
              const notification = rows.findIndex((r) => r.indexOf('Sending notification') !== -1);

              if (didNotFind !== -1) startJson = didNotFind + 1;
              if (correct !== -1) startJson = correct + 2;
              if (notification !== -1) endJson = notification;

              if (startJson === -1) throw `Could not find json start for ${file}`;
              if (endJson === -1) throw `Could not find json end for ${file}`;
              if (notification === -1) throw `Could not find notification for ${file}`;

              const numberString = rows[notification + 1].match(/(Wordle \d+)/)[1].replace('Wordle ', '');
              const wordleNumber = Number.parseInt(numberString);

              const possibilities = [];
              const possible = rows.map((r, i) => (r.indexOf('All possible') !== -1 ? i : -1)).filter((i) => i !== -1);
              const checking = rows.map((r, i) => (r.indexOf('Checking word') !== -1 ? i : -1)).filter((i) => i !== -1);

              if (possible.length !== checking.length) throw `Mismatched possible/checking sizes for ${file}`;
              possible.forEach((p, i) => {
                const row = rows[p];

                if (row.indexOf(']') !== -1) {
                  const value = row.slice(row.indexOf('['));
                  possibilities.push(json5.parse(value));
                } else {
                  const possibility =
                    '[' +
                    rows
                      .slice(p + 1, checking[i] - 1)
                      .join('\n')
                      .trim();

                  possibilities.push(json5.parse(possibility));
                }
              });

              const runNumber = Number.parseInt(f.replace('logs_', '').replace('.zip', ''));
              const timestamp = allData.find((r) => r.run_number === runNumber).created_at;

              const foundJson = rows.slice(startJson, endJson).join('\n').trim();
              const data = { ...json5.parse(foundJson), wordleNumber, possibilities, runNumber, timestamp };

              output.push(data);
            } else {
              entry.autodrain();
            }
          })
          .on('close', resolve);
      });
    }
  }

  console.log(`Parsed ${output.length} log files`);

  const outFile = join(dataDir, '/output.json');
  writeFileSync(outFile, JSON.stringify({ attempts: output }));
}

getData();
