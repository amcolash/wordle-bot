import React from 'react';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

export function Item(props) {
  const { item, selected, setSelected } = props;

  return (
    <div
      style={{ margin: 8, padding: 6, background: selected ? 'lime' : undefined, cursor: 'pointer', whiteSpace: 'nowrap' }}
      onClick={() => setSelected(item)}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: 8 }}>Wordle {item.wordleNumber}</span>
        {item.correct ? <FiCheckCircle /> : <FiXCircle />}
      </div>
      <div>{new Date(item.timestamp).toLocaleDateString()}</div>
    </div>
  );
}
