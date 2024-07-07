import React from 'react';
import { PlayListObject } from './PlayListObject';

const PlayListSection = ({ title, playlists }) => {
  return (
    <div className='playlist-section'>
      <div className='weeklyTop'>
        <h2>{title}</h2>
        <div className="playlists-container">
          {playlists.map((playlist) => (
            <PlayListObject key={playlist.id} playlist={playlist} />
          ))}
        </div>
      </div>
    </div>
  );
};

export { PlayListSection };
