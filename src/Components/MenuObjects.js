import React, { useEffect , useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function MenuObjects({ title, menuObjects, currentPage }) {
  const navigate = useNavigate();
  const [user, setUser] = useState("");

  axios.defaults.withCredentials = true;
  const onCustomButtonClick = (path) => {

    axios.get("http://localhost:8080/api/user/current")
        .then(response => {
          setUser(response.data['id']);
          if(path === "Liked"){
            navigate(`/Liked/${user}`);
          }else {
            navigate(path)
          }
        })
        .catch(error => {
          console.error("There was an error!", error);
        });
    
  }

  useEffect(() => {
    const allLi = document
      .querySelector(".MenuContainer ul")
      .querySelectorAll("li");

    allLi.forEach((n) => {
      if (n.textContent === currentPage) {
        n.classList.add("active");
      }
    });

    function changeMenuActive() {
      allLi.forEach((n) => n.classList.remove("active"));
      this.classList.add("active");
    }

    allLi.forEach((n) => n.addEventListener("click", changeMenuActive));

    return () => {
      allLi.forEach((n) => n.removeEventListener("click", changeMenuActive));
    };
  }, [currentPage]);

  // const handleItemClick = (name) => {
  //   onPageChange(name);
  // };

  return (
    <div className='MenuContainer'>
      <p className='title'>{title}</p>

      <ul>
        {menuObjects && menuObjects.map((menu) => (
          <li key={menu.id} onClick={() => onCustomButtonClick(menu.name)}>
            <a>
              <i>{menu.icon}</i>
              <span>{menu.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export { MenuObjects };
