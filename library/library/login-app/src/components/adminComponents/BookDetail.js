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
        return <div className="text-center">Loading...</div>; // Show loading state while fetching
    }

    return (
        <div className="container my-4">
            <div className="row">
                <div className="col-md-6">
                    <img src={book.photoURL} className="img-fluid" alt={book.title} />
                </div>
                <div className="col-md-6">
                    <h1>{book.title}</h1>
                    <h5>Author: {book.author}</h5>
                    <p><strong>Genre:</strong> {book.genre}</p>
                    <p><strong>Description:</strong> {book.description}</p>
                    <p><strong>Status:</strong> {book.status}</p>
                    <p><strong>Number of Books Available:</strong> {book.noOfBooks}</p>
                    <p><strong>Location:</strong> {book.location}</p>
                    <p><strong>Average Rating:</strong> {renderStars(averageRating)} ({averageRating})</p> {/* Displaying the average rating */}
                    <div className="d-flex justify-content-between align-items-center">
                        <Link to="/home" className="btn btn-secondary">Back to Home</Link>
                        <Link to={`/update/${book.id}`} className="btn btn-primary">Update</Link>
                    </div>
                </div>
            </div>

            <div className="mt-4">
                <h4>Customer Reviews</h4>
                {reviews.length > 0 ? (
                    reviews.map(review => (
                        <div key={review.id} className="border p-2 my-2">
                            <p><strong>{review.userName}</strong> {renderStars(review.rating)}</p>
                            <p>{review.comment}</p>
                        </div>
                    ))
                ) : (
                    <p>No reviews yet. Be the first to review this book!</p>
                )}
            </div>
        </div>
    );
};

export default BookDetail;
