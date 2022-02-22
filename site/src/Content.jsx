import React from 'react';

// TODO: Show / hide answers + letters
// TODO: Nicer styling of the letters
// TODO: More info in content
// TODO: Mobile friendly
// TODO: Dark Mode

export function Content(props) {
  const { selected, hidden } = props;

  let progress = [...selected.progress];
  while (progress.length < 6) progress.push({ guess: '     ', results: '     ' });

  console.log(progress);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <h1 style={{ textAlign: 'center' }}>
        Wordle {selected.wordleNumber}
        {!props.hidden && <span style={{ textTransform: 'capitalize' }}>: {selected.answer}</span>}
      </h1>
      {/* {JSON.stringify(selected)} */}
      {progress.map((p) => {
        const letters = p.guess.split('');
        const results = [...p.results];

        return <div style={{ display: 'flex' }}>{letters.map((l, i) => letter({ i, letter: l, result: results[i], hidden }))}</div>;
      })}
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
      key={props.i}
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
      }}
    >
      {props.hidden ? '' : props.letter}
    </div>
  );
}
