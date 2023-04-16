import React from 'react';
import {useState} from 'react';
import ReactDOM from 'react-dom/client';
import Profile from './pages/profile.js';
import Header from './components/header.js'
import Home from './pages/home.js'
import {API_URL} from './utils/backend.js';
import API from './utils/backend.js';
import {BrowserRouter, Route, Link, Routes, Router, useParams} from 'react-router-dom';
import './App.css';
import Navbar from './components/navbar.js'
const api = new API();

function NavBar(){
  return <p>Barra de navegacion</p>
}

function App(){
  const [headerTitle, setHeaderTitle] = useState('hola');
  const [buttonAction, setButtonAction] = useState(() => {});


  return (
    <BrowserRouter>
      {Navbar()}
      <div className="app-container">
        <div className="left-navbar ">
        {Header(headerTitle, buttonAction)}
          <Link to="/edua009">Profile</Link><br></br>
          <Link to="/">Go home</Link>
        </div>
        <div className="content">
        <Routes>
          <Route exact  path='/' element={<Home/>} />
          <Route exact  path='/:profileName' element={<Profile setButtonAction = {setButtonAction} setHeaderTitle = { (newTitle) => setHeaderTitle(newTitle) }/>} />
        </Routes>
        </div>
        <div className="right-navbar">
          {Header(headerTitle, buttonAction)}

        </div>
      </div>
    </BrowserRouter>
    )
}

export default App;