import React from 'react';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

export function Item(props) {
  const { item, selected, setSelected } = props;

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  const date = new Date(item.timestamp);

  return (
    <div
      style={{
        margin: '0.5em',
        padding: '0.5em',
        border: '2px solid transparent',
        borderColor: selected ? 'teal' : 'transparent',
        borderRadius: '0.3em',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        display: 'flex',
      }}
      onClick={() => setSelected(item)}
    >
      {item.correct ? <FiCheckCircle color="green" /> : <FiXCircle color="red" />}
      <div style={{ display: 'flex', flexDirection: 'column', margin: '0 0.5em' }}>
        <span>Wordle {item.wordleNumber}</span>
        <span>
          {monthNames[date.getMonth()]}, {date.getDate()}
        </span>
      </div>
      <span>({item.guesses}/6)</span>
    </div>
  );
}
