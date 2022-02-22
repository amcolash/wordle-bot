import React, { useEffect, useState } from 'react';
import { ref, getDatabase } from 'firebase/database';
import { useList } from 'react-firebase-hooks/database';

import { app } from './firebase';
import { Sidebar } from './Sidebar';
import { Content } from './Content';

const database = getDatabase(app);

export const AttemptList = () => {
  const [snapshots, loading, error] = useList(ref(database, 'attempts'));
  const [selected, setSelected] = useState();

  useEffect(() => {
    const items = filterAndSort(snapshots);
    if (!selected) setSelected(items[0]);
  }, [snapshots]);

  return (
    <>
      {error && <strong>Error: {error}</strong>}
      {loading && <span>List: Loading...</span>}
      {!loading && snapshots && (
        <div style={{ display: 'flex' }}>
          <Sidebar items={filterAndSort(snapshots)} selected={selected || {}} setSelected={setSelected} />
          {selected && <Content selected={selected} />}
        </div>
      )}
    </>
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
