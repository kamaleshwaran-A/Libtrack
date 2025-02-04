import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase/firebase";
import { signOut } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import ImageSlider from "../imagesider";
import PopularBooks from "../homenew";

const Home = () => {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const checkUserRole = () => {
            const role = localStorage.getItem("userRole");
            if (!role || role !== "student") {
                navigate("/login"); // Redirect if not a student
            }
        };

        const fetchBooks = async () => {
            const booksCollection = collection(db, 'books');
            const booksSnapshot = await getDocs(booksCollection);
            const booksList = booksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setBooks(booksList);
        };

        checkUserRole(); // Check user role first
        fetchBooks(); // Then fetch books
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/login");
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    const renderStars = (rating) => {
        const totalStars = 5;
        let stars = '';
        for (let i = 1; i <= totalStars; i++) {
            stars += i <= rating ? '⭐' : '☆';
        }
        return stars;
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDoubleClick = (book) => {
        navigate(`/stubook-detail/${book.id}`);
    };

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/profile">Profile</Link> {/* Changed to "Profile" */}
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <button className="nav-link btn" onClick={handleLogout}>Logout</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="container-fluid my-4"> {/* Changed to container-fluid for full screen */}
                <h1 className="text-center">Welcome to the Book Management App!</h1>
                <p className="text-center">Manage your books easily. Use the navigation bar to access different sections.</p>
                <div className="mb-4">
                    <ImageSlider />
                </div>
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

                <div className="row">
                    {filteredBooks.length === 0 ? (
                        <div className="col-12 text-center">
                            <h5>No books available. Please add some books!</h5>
                        </div>
                    ) : (
                        filteredBooks.map(book => (
                            <div className="col-md-4 mb-4" key={book.id}>
                                <div className="card h-100 shadow-sm" onDoubleClick={() => handleDoubleClick(book)}>
                                    {/*<img src={book.photoURL} className="card-img-top fixed-img" alt={book.title}/>*/}
                                    <img src={book.photoURL} className="card-img-top w-100 h-100" alt={book.title}
                                         style={{objectFit: 'cover'}}/>
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title">{book.title}</h5>
                                        <p className="card-text"><strong>Author:</strong> {book.author}</p>
                                        <p className="card-text"><strong>Genre:</strong> {book.genre}</p>
                                        <p className="card-text"><strong>Rating:</strong> {renderStars(book.rating)}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="mt-5">
                <PopularBooks />
                </div>
            </div>
        </div>
    );
};

export default Home;
