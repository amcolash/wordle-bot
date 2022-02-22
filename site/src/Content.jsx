import React from 'react';

export function Content(props) {
  const { selected } = props;
  return (
    <div>
      <h1>Wordle {selected.wordleNumber}</h1>
      {JSON.stringify(selected)}
      {/* {JSON.stringify(selected.progress)} */}
    </div>
  );
}
