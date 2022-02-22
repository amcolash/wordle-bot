import React from 'react';
import { Item } from './Item';

export function Sidebar(props) {
  const { items, selected, setSelected } = props;

  console.log(items);

  return (
    <div style={{ marginRight: '1em' }}>
      {items.map((item) => (
        <Item key={item.runNumber} item={item} selected={item.timestamp === selected.timestamp} setSelected={setSelected} />
      ))}
    </div>
  );
}
