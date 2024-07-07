import React, { useState, useEffect } from 'react';
import { FaHeadphones, FaRegClock, FaHeart, FaRegHeart } from 'react-icons/fa';
import { MusicPlayer } from './MusicPlayer';
import { performHttpRequest } from './../Utils/AuthUtils';
import axios from 'axios';

export const redirectToKeycloak = () => {
  const keycloakUrl = "http://localhost:9000/realms/musicAppRealm/protocol/openid-connect/auth";
  const clientId = "music_app_client";
  const redirectUri = "http://localhost:8080/api/auth";
  const state = "qwkejhkasldhqjkw";

  const url = `${keycloakUrl}?client_id=${clientId}&response_type=code&scope=openid&redirect_uri=${redirectUri}&state=${state}`;
  window.location.href = url;
};

function AudioList({ id ,flag}) {
  const [songs, setSongs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [auto, setAuto] = useState(false);
  const [list, setList] = useState([]);
  const [user, setUser] = useState("");

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get("http://localhost:8080/api/user/current")
      .then(response => {
        setUser(response.data['id']);
        setList(response.data["likedSongs"]);
      })
      .catch(error => {
        console.error("There was an error getting current user!", error);
      });
  }, []);


  useEffect(() => {
    let endpoint = "";
    if (flag === 'playList') {
      endpoint = `http://localhost:8080/api/playList/${id}/songs`;

      const fetchData = performHttpRequest(
        endpoint,
        (data) => {
          // Add the isLiked field to each song
          const updatedSongs = data.map(song => ({
            ...song,
            favorited: list.includes(song.id) // Check if the song id is in the list of liked songs
          }));
  
          setSongs(updatedSongs);
        },
        () => {
          redirectToKeycloak();
        }
      );
      fetchData();
    } else if (flag === 'user') {
      endpoint = `http://localhost:8080/api/user/${id}/getLikedSongs`;

      const fetchData = performHttpRequest(
        endpoint,
        (data) => {
          const updatedSongs = data.map(song => ({
            ...song,
            favorited: true // Check if the song id is in the list of liked songs
          }));
  
          setSongs(updatedSongs);
        },
        () => {
          redirectToKeycloak();
        }
      );
      fetchData();
    }
    
  }, [id, list]);



  const addToLiked = (userId, songId) => {
    axios.post(`http://localhost:8080/api/user/${userId}/addToLiked`, null, {
      params: { songId: songId }
    })
    .then(response => {
      console.log(response.data);
      // Update the local state to reflect the change
      setList([...list, songId]);
      setSongs(songs.map(song => 
        song.id === songId ? { ...song, isLiked: true } : song
      ));
    })
    .catch(error => {
      console.error("There was an error adding the song to liked songs!", error);
    });
  };


  const deleteLiked = (userId, songId) => {
    axios.delete(`http://localhost:8080/api/user/${userId}/deleteLiked`, {
      params: { songId: songId }
    })
    .then(response => {
      console.log(response.data);
      // Update the local state to reflect the change
      setList(list.filter(id => id !== songId));
      setSongs(songs.map(song => 
        song.id === songId ? { ...song, isLiked: false } : song
      ));
    })
    .catch(error => {
      console.error("There was an error removing the song from liked songs!", error);
    });
  };

  

  const changeFavorite = (id) => {
    const updatedSongs = songs.map(song => {
      if (song.id === id) {
        if(song.favorited === false){
          addToLiked(user, song.id);
        } else {
          deleteLiked(user, song.id);
        }
        return { ...song, favorited: !song.favorited };
      }
      return song;
    });
    setSongs(updatedSongs);
  };

  const setMainSong = (index) => {
    setCurrentIndex(index);
    setAuto(true);
  };

  const changeFavoriteStatus = (songId, favorited) => {
    const updatedSongs = songs.map(song => {
      if (song.id === songId) {
        return { ...song, favorited: favorited };
      }
      return song;
    });
    setSongs(updatedSongs);
  };

  return (
    <div className='audioList'>
      <h2 className='title'>The List <span>{`${songs.length} songs`}</span></h2>

      <div className='songsContainer'>
        {songs.map((song, index) => (
          <div
            className={`songs ${currentIndex === index ? 'playing' : ''}`}
            key={song.id}
            onClick={() => setMainSong(index)}
          >
            <div className='count'>{index + 1}</div>
            <div className='song'>
              <div className='imgBox'>
                <img src={song.photoUrl} alt='' />
              </div>
              <div className='section'>
                <p className='songName'>
                  {song.title}
                  <span className='spanArtist'>{song.artist}</span>
                </p>
                <div className='hits'>
                  <p className='hit'>
                    <i><FaHeadphones /></i> {song.playCount}
                  </p>
                  <p className='duration'>
                    <i><FaRegClock /></i>{song.time}
                  </p>
                  <div
                    className='favorite'
                    onClick={(e) => { e.stopPropagation(); changeFavorite(song.id); }}
                  >
                    {song.favorited ? (
                      <i><FaHeart /></i>
                    ) : (
                      <i><FaRegHeart /></i>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <MusicPlayer
        song={songs[currentIndex]?.songUrl}
        favorited = {songs[currentIndex]?.favorited}
        songId={songs[currentIndex]?.id}
        userId={user}
        imgSrc={songs[currentIndex]?.photoUrl || "https://imagesmusicapp.fra1.digitaloceanspaces.com/default.png"}
        auto={auto}
        songList={songs}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        changeFavoriteStatus={changeFavoriteStatus}
      />
    </div>
  );
}

export { AudioList };
