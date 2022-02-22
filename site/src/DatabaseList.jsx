import React from 'react';
import { ref, getDatabase } from 'firebase/database';
import { useList } from 'react-firebase-hooks/database';

import { app } from './firebase';

const database = getDatabase(app);

export const DatabaseList = () => {
  const [snapshots, loading, error] = useList(ref(database, 'attempts'));

  return (
    <div>
      <p>
        {error && <strong>Error: {error}</strong>}
        {loading && <span>List: Loading...</span>}
        {!loading && snapshots && (
          <React.Fragment>
            <span>
              List:{' '}
              {snapshots.map((v) => (
                <React.Fragment key={v.key}>{JSON.stringify(v.val())}, </React.Fragment>
              ))}
            </span>
          </React.Fragment>
        )}
      </p>
    </div>
  );
};
