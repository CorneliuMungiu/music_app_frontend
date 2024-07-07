import React, { useState, useRef, useEffect } from "react";
import "../Styles/MusicPlayer.css";
import {
  FaRegHeart,
  FaHeart,
  FaForward,
  FaRedo,
  FaBackward,
  FaPlay,
  FaPause,
  FaShareAlt,
} from "react-icons/fa";
import { FaShuffle } from "react-icons/fa6";
import axios from 'axios';

function MusicPlayer({ song, favorited, songId, userId,imgSrc, auto, songList, currentIndex, setCurrentIndex,changeFavoriteStatus }) {
  const [isLove, setLove] = useState(false);
  const [isPlaying, setPlay] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrenttime] = useState(0);
  const [isShuffle, setShuffle] = useState(false);
  const [isRepeat, setRepeat] = useState(false);

  const audioPlayer = useRef();
  const progressBar = useRef();
  const animationRef = useRef();


  useEffect(() => {
    // Setează starea inițială a inimioarei conform valorii primite în prop-ul favorited
    setLove(favorited);
  }, [favorited]);

  useEffect(() => {
    if (audioPlayer.current) {
      audioPlayer.current.onloadedmetadata = () => {
        const seconds = Math.floor(audioPlayer.current.duration);
        setDuration(seconds);
        progressBar.current.max = seconds;
      };
    }
  }, []);
  

  useEffect(() => {
    const seconds = Math.floor(audioPlayer.current.duration);
    setDuration(seconds);
    progressBar.current.max = seconds;
  }, [audioPlayer?.current?.loadedmetadata, audioPlayer?.current?.readyState]);

  const changePlayPause = () => {
    const prevValue = isPlaying;
    setPlay(!prevValue);

    if (!prevValue) {
      audioPlayer.current.play();
      animationRef.current = requestAnimationFrame(whilePlaying);
    } else {
      audioPlayer.current.pause();
      cancelAnimationFrame(animationRef.current);
    }
  };

  const whilePlaying = () => {
    if (audioPlayer == null || audioPlayer.current == null || audioPlayer.current.currentTime == null) {
      return;
    } else {
      progressBar.current.value = audioPlayer.current.currentTime;
      changeCurrentTime();
      animationRef.current = requestAnimationFrame(whilePlaying);
    }
  };

  const calculateTime = (sec) => {
    const minutes = Math.floor(sec / 60);
    const returnMin = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(sec % 60);
    const returnSec = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnMin}:${returnSec}`;
  };

  const changeProgress = () => {
    audioPlayer.current.currentTime = progressBar.current.value;
    changeCurrentTime();
  };

  const changeCurrentTime = () => {
    progressBar.current.style.setProperty(
      "--played-width",
      `${(progressBar.current.value / duration) * 100}%`
    );
    setCurrenttime(progressBar.current.value);
  };


  const handlePause = () => {
    setPlay(false);
    cancelAnimationFrame(animationRef.current);
  };

  const incrementPlayCount = () => {
    axios.put(`http://localhost:8080/api/songs/${songId}/incrementPlayCount`)
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.error("There was an error incrementing views count!", error);
    });
  };

  const handlePlay = () => {
    incrementPlayCount();
    setPlay(true);
    animationRef.current = requestAnimationFrame(whilePlaying);
  };

  const handleNext = () => {
    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * songList.length);
      setCurrentIndex(randomIndex);
    } else {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % songList.length);
    }
    incrementPlayCount();
    setPlay(true); // Pornire redare automată
  };
  
  

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + songList.length) % songList.length);
  };

  const toggleShuffle = () => {
    setShuffle(!isShuffle);
    if (isRepeat && !isShuffle) {
      setRepeat(false);
    }
  };
  

  const toggleRepeat = () => {
    setRepeat(!isRepeat);
    if (isShuffle && !isRepeat) {
      setShuffle(false);
    }
  };

  useEffect(() => {
    const handleEnd = () => {
      if (!isShuffle && isRepeat) {
        audioPlayer.current.currentTime = 0; // Redă de la început
        audioPlayer.current.play();
      } else if (!isShuffle && !isRepeat) {
        handleNext();
      } else if (isShuffle) {
        const randomIndex = Math.floor(Math.random() * songList.length);
        setCurrentIndex(randomIndex);
      }
    };
  
    audioPlayer.current.addEventListener("ended", handleEnd);
    
    return () => {
      if (audioPlayer.current !== null)
        audioPlayer.current.removeEventListener("ended", handleEnd);
    };
  }, [isShuffle, isRepeat, currentIndex]);
  
  const addToLiked = () =>{
    axios.post(`http://localhost:8080/api/user/${userId}/addToLiked`, null, {
      params: { songId: songId }
    })
    .then(response => {
      console.log(response.data);
      // Actualizează starea locală pentru a reflecta schimbarea în preferințele utilizatorului
      setLove(true); // Setează inimioara în starea de "liked"
    })
    .catch(error => {
      console.error("There was an error adding the song to liked songs!", error);
    });
  }

  const deleteLiked = () => {
    axios.delete(`http://localhost:8080/api/user/${userId}/deleteLiked`, {
      params: { songId: songId }
    })
    .then(response => {
      console.log(response.data);
      setLove(false);
    })
    .catch(error => {
      console.error("There was an error removing the song from liked songs!", error);
    });
  };

  const changeSongLove = () => {
    if (!isLove) {
      addToLiked();
    } else {
      deleteLiked();
    }
    setLove(!isLove);
    // Actualizează starea în AudioList
    changeFavoriteStatus(songId, !isLove);
  };
  


  return (
    <div className="musicPlayer">
      <div className="songImage">
        <img src={imgSrc} alt="" />
      </div>
      <div className="songAttributes">
        <audio
          src={song}
          preload="metadata"
          ref={audioPlayer}
          autoPlay={auto}
          onPlay={handlePlay}
          onPause={handlePause}
        />

        <div className="top">
          <div className="left">
            <div className="loved" onClick={changeSongLove}>
              {isLove ? (
                <i>
                  <FaHeart />
                </i>
              ) : (
                <i>
                  <FaRegHeart />
                </i>
              )}
            </div>
          </div>

          <div className="middle">
            <div className="back">
              <i onClick={toggleShuffle}>
                <FaShuffle className={isShuffle ? "active" : ""} />
              </i>
              <i onClick={handlePrev}>
                <FaBackward />
              </i>
            </div>
            <div className="playPause" onClick={changePlayPause}>
              {isPlaying ? (
                <i>
                  <FaPause />
                </i>
              ) : (
                <i>
                  <FaPlay />
                </i>
              )}
            </div>
            <div className="forward">
              <i onClick={handleNext}>
                <FaForward />
              </i>
              <i onClick={toggleRepeat}>
                <FaRedo className={isRepeat ? "active" : ""} />
              </i>
            </div>
          </div>

          <div className="right">
            <i>
              {/* <FaShareAlt /> */}
            </i>
          </div>
        </div>

        <div className="bottom">
          <div className="currentTime">{calculateTime(currentTime)}</div>
          <input
            type="range"
            className="progressBar"
            ref={progressBar}
            defaultValue="0"
            onChange={changeProgress}
            autoPlay={auto}
          />
          <div className="duration">
            {duration && !isNaN(duration) && calculateTime(duration)
              ? duration && !isNaN(duration) && calculateTime(duration)
              : "00:00"}
          </div>
        </div>
      </div>
    </div>
  );
}

export { MusicPlayer };
