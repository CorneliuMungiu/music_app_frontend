import { BsFillHouseFill } from 'react-icons/bs'
import { FaPodcast } from 'react-icons/fa'
import { BiSolidLike } from "react-icons/bi";

const MenuList = [{
    id : 1,
    icon : <BsFillHouseFill/>,
    name : "HOME",
},
{
    id : 2,
    icon : <FaPodcast/>,
    name : "Podcast",
},
{
    id : 3,
    icon : <BiSolidLike />,
    name : "Liked"
}

];

export {MenuList};