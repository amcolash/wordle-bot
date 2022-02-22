import React from 'react';

// TODO: Show / hide answers + letters
// TODO: Nicer styling of the letters
// TODO: More info in content
// TODO: Mobile friendly
// TODO: Dark Mode

export function Content(props) {
  const { selected } = props;

  return (
    <div>
      <h1>
        Wordle {selected.wordleNumber}: <span style={{ textTransform: 'capitalize' }}>{selected.answer}</span>
      </h1>
      {/* {JSON.stringify(selected)} */}
      {selected.progress.map((p) => {
        const letters = p.guess.split('');
        const results = [...p.results];

        return (
          <div key={p.guess} style={{ display: 'flex', margin: '0.5em' }}>
            {letters.map((l, i) => letter({ i, letter: l, result: results[i] }))}
          </div>
        );
      })}
    </div>
  );
}

const size = '1.75em';
function letter(props) {
  let color = '#EEE';
  if (props.result === '🟨' || props.result === '\uD83D') color = '#FC0';
  if (props.result === '🟩') color = '#2F0';

  return (
    <div
      key={props.i}
      style={{
        fontSize: '1.25em',
        textTransform: 'capitalize',
        width: size,
        height: size,
        border: '3px solid #333',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0.15em',
        background: color,
      }}
    >
      {props.letter}
    </div>
  );
}
