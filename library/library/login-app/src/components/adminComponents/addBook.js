// src/components/AddBook.js
import React, { useState } from 'react';
import { db } from '../../firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const AddBook = () => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [genre, setGenre] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('Available'); // Default status
    const [noOfBooks, setNoOfBooks] = useState(1); // Default number of books
    const [location, setLocation] = useState('');
    const [rating, setRating] = useState(1); // Default rating
    const navigate = useNavigate(); // Navigate back after adding

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'books'), {
                title,
                author,
                genre,
                photoURL,
                description,
                status,
                noOfBooks,
                location,
                rating // Include rating in the document
            });
            alert("Book added successfully!");
            navigate("/home"); // Redirect to home after adding
        } catch (error) {
            console.error("Error adding book:", error);
            alert("Error adding book, please try again."); // Error handling
        }
    };

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
            <div className="container my-4">
                <h1 className="text-center mb-4">Add New Book</h1>
                <form onSubmit={handleSubmit} className="shadow p-4 bg-white rounded">
                    <div className="mb-3">
                        <label className="form-label">Title</label>
                        <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Author</label>
                        <input type="text" className="form-control" value={author} onChange={(e) => setAuthor(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Genre</label>
                        <input type="text" className="form-control" value={genre} onChange={(e) => setGenre(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Photo URL</label>
                        <input type="url" className="form-control" value={photoURL} onChange={(e) => setPhotoURL(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} rows="5" minLength="200" required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Status</label>
                        <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="Available">Available</option>
                            <option value="Not Available">Not Available</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Number of Books Available</label>
                        <input type="number" className="form-control" value={noOfBooks} onChange={(e) => setNoOfBooks(e.target.value)} min="1" required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Location</label>
                        <input type="text" className="form-control" value={location} onChange={(e) => setLocation(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Rating</label>
                        <select className="form-select" value={rating} onChange={(e) => setRating(e.target.value)}>
                            <option value="1">1 Star</option>
                            <option value="2">2 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="5">5 Stars</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary">Add Book</button>
                </form>
            </div>
        </div>
    );
};

export default AddBook;
