import React from 'react';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

import { friendlyDate } from './util';

export function Item(props) {
  const { item, selected, setSelected } = props;

  return (
    <div
      style={{
        margin: '0.5rem 0.75rem',
        padding: '0.5rem',
        border: '2px solid transparent',
        borderColor: selected ? 'var(--blue)' : 'transparent',
        borderRadius: 'var(--border-radius)',
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
        <span>{friendlyDate(item.timestamp)}</span>
      </div>
    </div>
  );
}
