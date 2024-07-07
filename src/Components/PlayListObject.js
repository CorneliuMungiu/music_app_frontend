import React from 'react'
import '../Styles/HomePage.css'
import { useNavigate } from 'react-router-dom';


const PlayListObject = ({ playlist }) => {
const navigate = useNavigate();

const onCustomButtonClick = (id) => {
  navigate('/playList/' + id)
}
    return (
      <div className="playlist" onClick={()=>onCustomButtonClick(playlist.id)}>
        <div className="image-container">
          <img src={playlist.imageUrl} alt={playlist.name} className="playlist-image" />
          <div className="playlist-name">{playlist.name}</div>
        </div>
      </div>
    );
  };
  

export {PlayListObject};