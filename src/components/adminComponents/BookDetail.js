import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { db } from '../../firebase/firebase'; // Ensure Firebase is configured
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

const BookDetail = () => {
    const { id } = useParams(); // Get the book ID from the URL
    const [book, setBook] = useState(null); // Initialize book state
    const [reviews, setReviews] = useState([]); // Initialize reviews state
    const [loading, setLoading] = useState(true); // Track loading state
    const [averageRating, setAverageRating] = useState(0); // Initialize average rating state
    const navigate = useNavigate(); // Navigate for redirecting

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const bookDoc = await getDoc(doc(db, 'books', id)); // Fetch book by ID
                if (bookDoc.exists()) {
                    setBook({ id: bookDoc.id, ...bookDoc.data() }); // Set book state
                } else {
                    console.error("No such document!");
                }

                // Fetch reviews
                const reviewsCollection = collection(db, 'books', id, 'reviews');
                const reviewsSnapshot = await getDocs(reviewsCollection);
                const reviewsList = reviewsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setReviews(reviewsList); // Set reviews state

                // Calculate average rating
                if (reviewsList.length > 0) {
                    const totalRating = reviewsList.reduce((sum, review) => sum + review.rating, 0);
                    setAverageRating((totalRating / reviewsList.length).toFixed(1)); // Calculate and set average rating
                } else {
                    setAverageRating(0); // No reviews
                }
            } catch (error) {
                console.error("Error fetching book:", error);
            } finally {
                setLoading(false); // Set loading to false once data is fetched
            }
        };

        fetchBook();
    }, [id, navigate]); // Fetch book and reviews when the component mounts or ID changes

    const renderStars = (rating) => {
        const totalStars = 5;
        let stars = '';
        for (let i = 1; i <= totalStars; i++) {
            stars += i <= rating ? '⭐' : '☆'; // Filled star for rating, hollow for the rest
        }
        return stars; // Return the star string
    };

    if (loading) {
        return <div className="text-center py-5">Loading...</div>; // Show loading state while fetching
    }

    return (
        <div className="container my-5">
            <div className="row">
                {/* Book Cover Section */}
                <div className="col-md-4 text-center">
                    <img
                        src={book.photoURL}
                        className="img-fluid rounded shadow-lg"
                        alt={book.title}
                        style={{ maxHeight: '500px', width: 'auto' }}
                    />
                </div>

                {/* Book Details Section */}
                <div className="col-md-8">
                    <h1 className="display-4">{book.title}</h1>
                    <h5 className="text-muted">By {book.author}</h5>
                    <div className="my-4">
                        <span className="badge bg-primary me-2">{book.genre}</span>
                        <span className="badge bg-success">{book.status}</span>
                    </div>
                    <p className="lead">{book.description}</p>
                    <div className="my-4">
                        <p><strong>Number of Books Available:</strong> {book.noOfBooks}</p>
                        <p><strong>Location:</strong> {book.location}</p>
                        <p><strong>Average Rating:</strong> {renderStars(averageRating)} ({averageRating}/5)</p>
                    </div>
                    <div className="d-flex gap-3">
                        <Link to="/home" className="btn btn-outline-secondary">
                            <i className="fas fa-arrow-left me-2"></i>Back to Home
                        </Link>
                        <Link to={`/update/${book.id}`} className="btn btn-primary">
                            <i className="fas fa-edit me-2"></i>Update Book
                        </Link>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-5">
                <h3 className="mb-4">Customer Reviews</h3>
                {reviews.length > 0 ? (
                    reviews.map(review => (
                        <div key={review.id} className="card mb-3">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h5 className="card-title mb-0">{review.userName}</h5>
                                    <span className="text-warning">{renderStars(review.rating)}</span>
                                </div>
                                <p className="card-text">{review.comment}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="alert alert-info" role="alert">
                        No reviews yet. Be the first to review this book!
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookDetail;