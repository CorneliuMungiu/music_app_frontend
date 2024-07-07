import React ,{useEffect, useState} from 'react'
import Artist from '../img/afro-girl-enjoying-music-wearing-sunglasses-and-headphone-banner-vector.jpg'
import Check from '../img/pngtree-blue-verified-check-mark-icons-illustrations-transparent-png-image_6703692.png'
import {FaEllipsisH, FaHeadphones, FaCheck, FaPlus,FaTrash} from 'react-icons/fa'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Banner() {
  const { id } = useParams();
  const [playListName, setPlayListName] = useState('');
  const [playListViews, setPlayListViews] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [user, setUser] = useState("");
  const [playListOwner, setPlayListOwner] = useState("");
  const navigate = useNavigate();

  const onCustomButtonClick = () => {
    navigate('/HOME');
  }

  useEffect(() => {
    axios.get(`http://localhost:8080/api/playList/${id}/getPlayListOwner`)
      .then(response => {
        setPlayListOwner(response.data);
      })
      .catch(error => {
        console.error("There was an error getting playlist owner!", error);
      });
  }, [id]);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/playList/${id}/getPlayListName`)
      .then(response => {
        setPlayListName(response.data);
      })
      .catch(error => {
        console.error("There was an error getting playlist name!", error);
      });
  }, [id]);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/playList/${id}/getViews`)
      .then(response => {
        setPlayListViews(response.data);
      })
      .catch(error => {
        console.error("There was an error getting playlist Views!", error);
      });
  }, [id]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/user/current")
      .then(response => {
        setUser(response.data['id']);
      })
      .catch(error => {
        console.error("There was an error getting current user!", error);
      });
  }, []);

  useEffect(() => {
    if (user) {
      getFollow();
    }
  }, [user]);

  const getFollow = () => {
    axios.get(`http://localhost:8080/api/playList/${id}/isFollowing`, {
      params : {userId : user}
    })
    .then (response => {
      setIsFollowing(response.data);
    })
    .catch(error => {
      console.error("There was an error getting follow!", error);
    });
  }

  const followPlayList = () => {
    axios.post(`http://localhost:8080/api/user/${user}/addPlaylistToUser`, null, {
      params :{playlistId : id}
    })
    .catch(error => {
      console.error("There was an error when following playList!", error);
    });
  }

  const deleteFollowPlayList = () => {
    axios.delete(`http://localhost:8080/api/user/${user}/deletePlayListFromUser`, {
      params :{playlistId : id}
    })
    .catch(error => {
      console.error("There was an error when following playList!", error);
    });
  }

  const deletePlayList = () => {
    axios.delete(`http://localhost:8080/api/playList/${id}/deletePlayList`, {
      params :{userId : user}
    })
    .catch(error => {
      console.error("There was an error when deleting playList!", error);
    });
  }


  const handleFollowClick = () => {
    if(isFollowing === false){
      followPlayList();
    } else {
      onCustomButtonClick();
      deletePlayList();
      deleteFollowPlayList();
    }
    setIsFollowing(!isFollowing);
  };
  
  return (
    <div className='banner'>
      <img src={Artist} alt="" className='bannerImg'/>

      <div className='content'>
        <div className='breadCrump'>
          <p>
            {/* Home <span>Popular Artist</span> */}
          </p>

          <i>
            {/* <FaEllipsisH/> */}
          </i>
          
        </div>
        <div className='artist'>
            <div className='left'>
              <div className='name'>
                <h2>{playListName}</h2>
                <img src={Check} alt=''/>
              </div>
              <p>
                <i>
                  <FaHeadphones/>
                </i> {playListViews} <span>Listeners</span>
              </p>
            </div>
            <div className='right'>
            <button onClick={handleFollowClick} className={user === playListOwner ? 'delete' : (isFollowing ? 'following' : 'follow')}>
              <i>
                {user === playListOwner ? <FaTrash /> : (isFollowing ? <FaCheck /> : <FaPlus />)}
              </i> {user === playListOwner ? 'Delete' : (isFollowing ? 'Following' : 'Follow')}
            </button>

          </div>
          </div>
      </div>
      <div className='bottomLayer'>

      </div>
    </div>
  );
}

export {Banner};