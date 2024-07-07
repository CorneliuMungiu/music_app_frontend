import React, { useEffect, useState } from 'react';
import { FaPlus,FaSave } from 'react-icons/fa';
import { BsMusicNoteList, BsTrash } from 'react-icons/bs';
import { PlayList } from './Playlist';
import { MdCancel } from "react-icons/md";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function MenuPlaylist() {
    const [user, setUser] = useState("");
    const [playListsIds, setPlayListsIds] = useState([]);
    const [playLists, setPlayLists] = useState([]);
    const [newPlaylistName, setNewPlaylistName] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    const navigate = useNavigate();

    const onCustomButtonClick = (id) => {
        navigate('/playList/' + id)
    }

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
            axios.get(`http://localhost:8080/api/user/${user}/getFollow`)
                .then(response => {
                    setPlayListsIds(response.data);
                })
                .catch(error => {
                    console.error("There was an error getting getFollow!", error);
                });
        }
    }, [user]);

    useEffect(() => {
        if (playListsIds.length > 0) {
            Promise.all(playListsIds.map(id =>
                axios.get(`http://localhost:8080/api/playList/${id}`)
                    .then(response => response.data)
                    .catch(error => {
                        console.error(`There was an error getting playlist with id ${id}`, error);
                        return null;
                    })
            )).then(playListsData => {
                // Filter out any null responses
                setPlayLists(playListsData.filter(data => data !== null));
            });
        }
    }, [playListsIds]);

    const followPlayList = (id) => {
        axios.post(`http://localhost:8080/api/user/${user}/addPlaylistToUser`, null, {
          params :{playlistId : id}
        })
        .catch(error => {
          console.error("There was an error when following playList!", error);
        });
    }

    const deletePlayList = (playListId) => {
        axios.delete(`http://localhost:8080/api/playList/${playListId}/deletePlayList`, {
            params :{userId : user}
          })
          .catch(error => {
            console.error("There was an error when deleting following playList!", error);
          });
    }

    const deleteFollowPlayList = (id) => {
        axios.delete(`http://localhost:8080/api/user/${user}/deletePlayListFromUser`, {
            params: { playlistId: id }
        })
            .then(() => {
                deletePlayList(id);
                setPlayLists(playLists.filter(list => list.id !== id));
            })
            .catch(error => {
                console.error("There was an error when following playList!", error);
            });
    }

    const createNewPlaylist = () => {
        const requestData = {
            name: newPlaylistName,
            songs: [] 
        };

        axios.post(`http://localhost:8080/api/playList/${user}/newEmptyPlayList`, requestData)
        .then(response =>{
            const newPlaylist = response.data;
            followPlayList(newPlaylist.id);
            setPlayLists([...playLists, newPlaylist]);
            setNewPlaylistName("");
            setIsCreating(false);
        })
        .catch(error => {
            console.error("Error creating playlist:", error);
            if (error.response) {
                console.error("Server responded with:", error.response.data);
            }
        });
    }

    const cancelCreatePlaylist = () => {
        setNewPlaylistName("");
        setIsCreating(false);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            createNewPlaylist();
        }
    };


    return (
        <div className='playListContainer'>
            <div className='nameContainer'>
                <p>Playlist</p>
                <i onClick={() => setIsCreating(true)}>
                    <FaPlus />
                </i>
            </div>
            <div className='playListScroll'>
                {isCreating && (
                    <div className='playList newPlaylistForm'>
                        <i className='list' onClick={cancelCreatePlaylist}>
                            <MdCancel />
                        </i>
                        <input 
                            type="text" 
                            value={newPlaylistName}
                            onChange={(e) => setNewPlaylistName(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Enter playlist name"
                            className="newPlaylistInput"
                        />
                        <i className='save' onClick={createNewPlaylist}>
                            <FaSave/>
                        </i>
                    </div>
                )}
                {playLists.map((list) => (
                    <div className='playList' key={list.id} onClick={()=>onCustomButtonClick(list.id)}>
                        <i className='list'>
                            <BsMusicNoteList />
                        </i>
                        <p>{list.name}</p>
                        <i className='trash' onClick={() => deleteFollowPlayList(list.id)}>
                            <BsTrash />
                        </i>
                    </div>
                ))}
            </div>
        </div>
    )
}

export { MenuPlaylist };
