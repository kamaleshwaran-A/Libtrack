import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db } from '../../firebase/firebase';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import PopularBooks from "../homenew";
import ImageSlider from "../imagesider";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";

const Home = () => {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchBooks = async () => {
            const booksCollection = collection(db, 'books');
            const booksSnapshot = await getDocs(booksCollection);
            const booksList = booksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setBooks(booksList);
        };

        fetchBooks();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, 'books', id));
            setBooks(books.filter(book => book.id !== id));
        } catch (error) {
            console.error("Error deleting book:", error);
            alert("Error deleting book, please try again.");
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/login");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDoubleClick = (book) => {
        navigate(`/book-detail/${book.id}`, { state: { book } });
    };

    const renderStars = (rating) => {
        const totalStars = 5;
        let stars = '';
        for (let i = 1; i <= totalStars; i++) {
            stars += i <= rating ? '⭐' : '☆';
        }
        return stars;
    };

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/fine">My Library</Link>
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
                            <li className="nav-item">
                                <button className="nav-link btn btn-link text-decoration-none text-white" onClick={handleLogout}>
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="container my-4">
                <h1 className="text-center">Welcome to the Book Management App!</h1>
                <p className="text-center">Manage your books easily. Use the navigation bar to access different sections.</p>

                <div className="input-group mb-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by title or author"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <button className="btn btn-outline-secondary" type="button">Search</button>
                </div>
                <div className="text-center mb-4">
                    <Link to="/add" className="btn btn-success btn-lg">Add New Book</Link>
                </div>

                <div className="row">
                    {filteredBooks.length === 0 ? (
                        <div className="col-12 text-center">
                            <h5>No books available. Please add some books!</h5>
                        </div>
                    ) : (
                        filteredBooks.map(book => (
                            <div className="col-md-4 mb-4" key={book.id}>
                                <div className="card h-100 shadow-sm" onDoubleClick={() => handleDoubleClick(book)}>
                                    <img src={book.photoURL} className="card-img-top fixed-img" alt={book.title} />
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title">{book.title}</h5>
                                        <p className="card-text"><strong>Author:</strong> {book.author}</p>
                                        <p className="card-text"><strong>Genre:</strong> {book.genre}</p>
                                        <p className="card-text"><strong>Rating:</strong> {renderStars(book.rating)}</p>
                                        <div className="d-flex justify-content-between">
                                            <Link to={`/update/${book.id}`} className="btn btn-primary">Update</Link>
                                            <button onClick={() => handleDelete(book.id)} className="btn btn-danger">Delete</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                {/* Render the PopularBooks component here */}
                <PopularBooks />
            </div>
        </div>
    );
};

export default Home;
