import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebase'; // Import Firebase Firestore instance
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const Delete = () => {
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchBooks = async () => {
            const booksCollection = collection(db, 'books'); // Adjust the collection name as needed
            const booksSnapshot = await getDocs(booksCollection);
            const booksList = booksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setBooks(booksList);
        };

        fetchBooks();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, 'books', id)); // Adjust the collection name as needed
            setBooks(books.filter(book => book.id !== id)); // Update local state
        } catch (error) {
            console.error("Error deleting book:", error);
            alert("Error deleting book, please try again.");
        }
    };

    // Filter books based on the search term
    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
            {/* Navigation Bar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">My App</Link>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/home">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/books">Update</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/delete">Delete</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="container my-4">
                <h1 className="text-center mb-4">Delete Books</h1>

                {/* Search Input */}
                <div className="mb-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="row">
                    {filteredBooks.length === 0 ? (
                        <div className="col-12 text-center">
                            <h5>No books available to delete.</h5>
                        </div>
                    ) : (
                        filteredBooks.map(book => (
                            <div className="col-md-4 mb-4" key={book.id}>
                                <div className="card h-100 shadow-sm">
                                    <img src={book.photoURL} className="card-img-top fixed-img" alt={book.title} />
                                    <div className="card-body">
                                        <h5 className="card-title">{book.title}</h5>
                                        <p className="card-text"><strong>Author:</strong> {book.author}</p>
                                        <p className="card-text"><strong>Genre:</strong> {book.genre}</p>
                                        <button onClick={() => handleDelete(book.id)} className="btn btn-danger">Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Delete;
