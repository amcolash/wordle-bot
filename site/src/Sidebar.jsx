import React from 'react';
import { Item } from './Item';

export function Sidebar(props) {
  const { items, selected, setSelected } = props;

  return (
    <div style={{ overflow: 'auto', flexShrink: 0 }}>
      {items.map((item) => (
        <Item key={item.runNumber} item={item} selected={item.timestamp === selected.timestamp} setSelected={setSelected} />
      ))}
    </div>
  );
}
