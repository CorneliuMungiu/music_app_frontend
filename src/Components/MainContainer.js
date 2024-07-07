import React , {useEffect} from 'react'
import '../Styles/MainContainer.css'
import {Banner} from "./Banner"
import {AudioList} from "./AudioList"
import {FaUsers} from 'react-icons/fa'
import { useParams, useLocation} from 'react-router-dom';



function MainContainer() {
  const { id } = useParams();
  const location = useLocation();

  useEffect(() => {
    const allLi = document
    .querySelector(".menuList")
    .querySelectorAll("li");

    function changeMenuActive() {
        allLi.forEach((n) => n.classList.remove("active"));
        this.classList.add("active");
    }

    allLi.forEach((n) => n.addEventListener("click", changeMenuActive));
  }, []);

  const isPlaylistRoute = location.pathname.includes("/playList/");
  const isLikedRoute = location.pathname.includes("/Liked/");

  return (
    <div className='mainContainer'>
        <Banner/>

      <div className='menuList'>
        <p>
          <i>
            <FaUsers/>
          </i> 12.3M <span>Followers</span>
        </p>
      </div>


      {isPlaylistRoute && <AudioList id={id} flag={"playList"} />}
      {isLikedRoute && <AudioList id={id} flag={"user"}/>}

    </div>
  )
}

export { MainContainer };