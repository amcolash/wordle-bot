import React from 'react';

export function IconButton(props) {
  return (
    <button
      {...props}
      style={{
        ...props.style,
        display: 'flex',
        alignContent: 'center',
        alignItems: 'center',
        padding: '0.5rem',
        fontSize: '1.5rem',
        background: 'none',
        border: '2px solid var(--color-tone-4)',
        color: 'var(--color-tone-1)',
      }}
    />
  );
}
