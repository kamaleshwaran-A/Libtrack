// src/App.js
import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom"; // Changed to HashRouter
import Login from "./components/loginComponents/login";
import Register from "./components/loginComponents/register";
import Home from "./components/adminComponents/home";
import Update from './components/adminComponents/update';
import Delete from './components/adminComponents/delete';
import Fine from './components/adminComponents/fine';
import AddBook from './components/adminComponents/addBook';
import BookDetail from './components/adminComponents/BookDetail';
import BooksList from './components/adminComponents/bookUpdate';
import StudentBook from './components/userComponenets/studentHome';
import Profile from "./components/userComponenets/profile";
import SruBookDetail from "./components/userComponenets/stuBookDetail";
import NewHome from "./components/homenew";
import Preloader from "../src/components/Pre";
import "./style.css";

function App() {
  const [load, upadateLoad] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      upadateLoad(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <Preloader load={load} />
      <div className="App" id={load ? "no-scroll" : "scroll"}>

        <Routes>
          <Route path="/library" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/fine" element={<Fine />} />
          <Route path="/update/:id" element={<Update />} />
          <Route path="/delete" element={<Delete />} />
          <Route path="/books" element={<BooksList />} />
          <Route path="/add" element={<AddBook />} />
          <Route path="/book-detail/:id" element={<BookDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/student-home" element={<StudentBook />} />
          <Route path="/stubook-detail/:id" element={<SruBookDetail />} />
          <Route path="/new-home" element={<NewHome />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
