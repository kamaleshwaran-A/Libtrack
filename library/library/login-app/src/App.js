// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

function App() {
  return (
      <Router>
        <div className="container mt-4">
          <Routes>
            <Route path="/library" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<Home />} />
            <Route path="/fine" element={<Fine />} />
            <Route path="/update/:id" element={<Update/>} />
            <Route path="/delete" element={<Delete />} />
            <Route path="/books" element={<BooksList />} />
            <Route path="/add" element={<AddBook />} />
            <Route path="/book-detail/:id" element={<BookDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/student-home" element={<StudentBook />} />
            <Route path="/stubook-detail/:id" element={<SruBookDetail/>} />
            <Route path="/new-home" element={<NewHome />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
