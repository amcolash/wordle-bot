import React, { useEffect, useState } from 'react';
import { ref, getDatabase } from 'firebase/database';
import { useList } from 'react-firebase-hooks/database';

import { app } from './firebase';
import { Sidebar } from './Sidebar';
import { Content } from './Content';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { IconButton } from './IconButton';

const database = getDatabase(app);

export const AttemptList = () => {
  const [snapshots, loading, error] = useList(ref(database, 'attempts'));
  const [selected, setSelected] = useState();
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const items = filterAndSort(snapshots);
    if (!selected) setSelected(items[0]);
  }, [snapshots]);

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
      }}
    >
      {error && <strong style={{ fontSize: '1.5rem' }}>Error: {error}</strong>}
      {loading && <span style={{ fontSize: '1.5rem' }}>Loading Data...</span>}
      {!loading && snapshots && (
        <div style={{ display: 'flex', height: '100%', width: '100%' }}>
          <Sidebar items={filterAndSort(snapshots)} selected={selected || {}} setSelected={setSelected} />
          {selected && <Content selected={selected} hidden={hidden} />}
        </div>
      )}
      <IconButton onClick={() => setHidden(!hidden)} style={{ position: 'fixed', bottom: '0.5rem', right: '0.5rem' }}>
        {hidden ? <FiEyeOff /> : <FiEye />}
      </IconButton>
    </div>
  );
};

function filterAndSort(snapshots) {
  const unique = new Set();
  const items = snapshots
    .map((s) => s.val())
    .sort((a, b) => {
      if (b.wordleNumber !== a.wordleNumber) return b.wordleNumber - a.wordleNumber;
      else return b.runNumber - a.runNumber;
    })
    .filter((i) => {
      if (unique.has(i.wordleNumber)) return false;
      else {
        unique.add(i.wordleNumber);
        return true;
      }
    });

  return items;
}
