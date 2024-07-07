import React from 'react';
import '../Styles/Menu.css';
import { FaSpotify, FaEllipsisH } from "react-icons/fa";
import { BiSearchAlt } from 'react-icons/bi';
import { MenuObjects } from './MenuObjects';
import { MenuList } from './MenuList';
import { MenuPlaylist } from './MenuPlaylist';
import { TrackList } from './TrackList';
import { useNavigate } from 'react-router-dom';

function Menu() {
  const navigate = useNavigate();
  const handleClick = () => {
  navigate('/HOME')
}

  return (
    <div className='menu'>
      <div className='logoContainer'>
        <i onClick={() => handleClick()}><FaSpotify /></i>
        <h2 onClick={() => handleClick()}>Spotify</h2>
        <i></i>
      </div>

      <div className='searchBox'>
        <input type='text' placeholder='Search...' />
        <i className='searchIcon'>
          <BiSearchAlt />
        </i>
      </div>

      <MenuObjects title={'Menu'} menuObjects={MenuList} />

      <MenuPlaylist />

      {/* <TrackList /> */}
    </div>
  );
}

export { Menu };
