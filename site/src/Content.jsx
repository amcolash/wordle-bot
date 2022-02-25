import React, { useEffect, useState } from 'react';

import { friendlyDate } from './util';

// TODO: Show / hide answers + letters
// TODO: Nicer styling of the letters
// TODO: More info in content
// TODO: Mobile friendly
// TODO: Dark Mode

export function Content(props) {
  const { selected, hidden } = props;

  const [selectedProgress, setSelectedProgress] = useState();

  useEffect(() => {
    setSelectedProgress(!hidden ? 0 : undefined);
  }, [selected, hidden]);

  let progress = [...selected.progress];
  while (progress.length < 6) progress.push({ guess: '     ', results: '     ' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }} onClick={() => setSelectedProgress()}>
      <h1 style={{ textAlign: 'center', marginBottom: 0 }}>
        Wordle {selected.wordleNumber}
        {!props.hidden && <span style={{ textTransform: 'capitalize' }}>: {selected.answer}</span>}
      </h1>
      <h2 style={{ marginTop: '0.25rem' }}>{friendlyDate(selected.timestamp)}</h2>

      <h3 style={{ color: 'var(--orange)', marginTop: 0, marginBottom: '0.5rem', visibility: selected.correct && 'hidden' }}>
        Failed {selected.comment}
      </h3>

      {progress.map((p, i) => {
        const letters = p.guess.split('');
        const results = [...p.results];

        return (
          <div
            key={i}
            style={{
              display: 'flex',
              border: `3px solid ${i === selectedProgress && !hidden ? 'var(--blue)' : 'transparent'}`,
              borderRadius: 'var(--border-radius)',
            }}
            onClick={(e) => {
              if (p.guess !== '     ' && !hidden) {
                e.stopPropagation();
                setSelectedProgress(i);
              }
            }}
          >
            {letters.map((l, j) => letter({ j, letter: l, result: results[j], hidden }))}
          </div>
        );
      })}

      {!hidden && selectedProgress !== undefined && selected.possibilities[selectedProgress] && (
        <Possibilities possibilities={selected.possibilities[selectedProgress]} />
      )}
    </div>
  );
}

const size = '8.5vw';
function letter(props) {
  let background;
  if (props.result === '⬛') background = 'var(--color-tone-4)';
  if (props.result === '🟨' || props.result === '\uD83D') background = 'var(--yellow)';
  if (props.result === '🟩') background = 'var(--green)';

  return (
    <div
      key={props.j}
      style={{
        fontSize: '1.25rem',
        fontWeight: 'bold',
        textTransform: 'capitalize',
        width: `min(${size}, 4rem)`,
        height: `min(${size}, 4rem)`,
        outline: props.result === ' ' && '3px solid var(--color-tone-4)',
        outlineOffset: '-3px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: `calc(min(${size}, 4rem) / 10)`,
        background,
        color: 'var(--color-tone-1)',
        userSelect: 'none',
      }}
    >
      {props.hidden ? '' : props.letter}
    </div>
  );
}

function Possibilities(props) {
  const { possibilities } = props;

  let min = 999;
  let max = -999;

  const parsed = possibilities.map((p) => {
    const word = p.split(':')[0];
    const score = Number.parseFloat(p.split(':')[1]);

    if (score < min) min = score;
    if (score > max) max = score;

    return { word, score };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h3 style={{ textAlign: 'center' }}>Possibilities:</h3>
      {parsed.map((p) => {
        return (
          <div key={p.word} style={{ display: 'flex', justifyContent: 'space-between', width: '100%', margin: '0.35rem' }}>
            <div style={{ marginRight: '0.75rem' }}>
              <strong>{p.word}</strong>
              {/* <span>: {p.score.toFixed(5)}</span> */}
            </div>
            <progress min={min} max={max} value={min === max ? 999 : p.score} style={{ width: '6rem' }} />
          </div>
        );
      })}
    </div>
  );
}
