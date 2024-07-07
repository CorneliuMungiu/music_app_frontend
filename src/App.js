import React from 'react';
import './App.css';
import { MainContainer } from './Components/MainContainer';
import { Menu } from './Components/Menu';
import { RightMenu } from './Components/RightMenu';
import { HomePage } from './Components/HomePage';
import {
  BrowserRouter as Router, Routes, Route 
} from "react-router-dom";



function App() {

  return (

    <Router>
    <div className="App">
    <Menu/>
    <Routes>
      <Route exact path="/" Component={HomePage} />
      <Route exact path="/HOME" Component={HomePage} />
      <Route exact path="/Podcast" Component={MainContainer} />
      <Route exact path="/playList/:id" Component={MainContainer} />
      <Route exact path="/Liked/:id" Component={MainContainer} />
    </Routes>
      
      {/* {currentPage === 'HOME' && <HomePage />}
      {currentPage === 'Podcast' && <MainContainer />} */}
      <RightMenu />
      <div className="background"></div>
    </div>

    </Router>
  );
}



export default App;
