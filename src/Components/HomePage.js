import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlayListSection } from './PlayListSection';
import '../Styles/HomePage.css';
import { performHttpRequest } from '../Utils/AuthUtils'
import {redirectToKeycloak} from '../Components/AudioList'

function HomePage() {
  const [playlistSections, setPlaylistSections] = useState([]);

  useEffect(() => {
    const fetchData = performHttpRequest(
        'http://localhost:8080/api/songs',
        () => {
        },
        () => {
            redirectToKeycloak();
        }
    );

    fetchData();
}, []);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/globalPlayLists');
        const sections = response.data;
        
        const playlistPromises = sections.map(async (section) => {
          const playlists = await Promise.all(
            section.playLists.map(async (playlistId) => {
              const playlistResponse = await axios.get(`http://localhost:8080/api/playList/${playlistId}`);
              return {
                id: playlistResponse.data.id,
                name: playlistResponse.data.name,
                imageUrl: playlistResponse.data.photoUrl,
              };
            })
          );
          return {
            title: section.title,
            playlists: playlists,
          };
        });

        const detailedSections = await Promise.all(playlistPromises);
        setPlaylistSections(detailedSections);
      } catch (error) {
        console.error('Error fetching playlists', error);
      }
    };

    fetchPlaylists();
  }, []);

  return (
    <div className='homePage'>
      {playlistSections.map((section, index) => (
        <PlayListSection key={index} title={section.title} playlists={section.playlists} />
      ))}
    </div>
  );
}

export { HomePage };
