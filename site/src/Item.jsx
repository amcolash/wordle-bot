import React from 'react';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

export function Item(props) {
  const { item, selected, setSelected } = props;

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  const date = new Date(item.timestamp);

  return (
    <div
      style={{
        margin: '0.5rem 0.75rem',
        padding: '0.5rem',
        border: '2px solid transparent',
        borderColor: selected ? 'var(--blue)' : 'transparent',
        borderRadius: '0.3rem',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        display: 'flex',
      }}
      onClick={() => setSelected(item)}
    >
      {item.correct ? <FiCheckCircle color="var(--green)" /> : <FiXCircle color="var(--orange)" />}
      <div style={{ display: 'flex', flexDirection: 'column', margin: '0 0.5rem' }}>
        <span>
          #{item.wordleNumber} ({item.guesses}/6)
        </span>
        <span>
          {monthNames[date.getMonth()]}, {date.getDate()}
        </span>
      </div>
    </div>
  );
}
