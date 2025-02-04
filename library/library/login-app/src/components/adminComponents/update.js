import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateBook = () => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [genre, setGenre] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('Available');
    const [noOfBooks, setNoOfBooks] = useState(1);
    const [location, setLocation] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookDetails = async () => {
            const bookRef = doc(db, 'books', id);
            const bookSnap = await getDoc(bookRef);
            if (bookSnap.exists()) {
                const bookData = bookSnap.data();
                setTitle(bookData.title);
                setAuthor(bookData.author);
                setGenre(bookData.genre);
                setPhotoURL(bookData.photoURL);
                setDescription(bookData.description || '');
                setStatus(bookData.status || 'Available');
                setNoOfBooks(bookData.noOfBooks || 1);
                setLocation(bookData.location || '');
            } else {
                console.error("No such document!");
                navigate('/home');
            }
        };
        fetchBookDetails();
    }, [id, navigate]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const bookRef = doc(db, 'books', id);
            await updateDoc(bookRef, {
                title,
                author,
                genre,
                photoURL,
                description,
                status,
                noOfBooks,
                location
            });
            alert("Book updated successfully!");
            navigate("/home");
        } catch (error) {
            console.error("Error updating book:", error);
            alert("Error updating book, please try again.");
        }
    };

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
            <div className="container my-4">
                <h1 className="text-center mb-4">Update Book Details</h1>
                <div className="card shadow-sm">
                    <div className="card-body">
                        <form onSubmit={handleUpdate}>
                            <div className="mb-3">
                                <label className="form-label">Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Author</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Genre</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={genre}
                                    onChange={(e) => setGenre(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Photo URL</label>
                                <input
                                    type="url"
                                    className="form-control"
                                    value={photoURL}
                                    onChange={(e) => setPhotoURL(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-control"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows="5"
                                    minLength="200"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Status</label>
                                <select
                                    className="form-select"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="Available">Available</option>
                                    <option value="Not Available">Not Available</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Number of Books Available</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={noOfBooks}
                                    onChange={(e) => setNoOfBooks(e.target.value)}
                                    min="1"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Location</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100">Update Book</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateBook;
